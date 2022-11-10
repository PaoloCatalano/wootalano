import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequest("Please provide all values");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search, searchCompany } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  // add stuff based on condition
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
    // queryObject.company = { $regex: search, $options: "i" };
    // "i" = case Insensitive
  }
  if (searchCompany) {
    queryObject.company = { $gte: searchCompany };
  }

  // NO AWAIT (non vogliamo il risultato subito..prima vogliamo la query)
  let result = Job.find(queryObject);

  // chain sort conditions

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject); //.countDocuments IMPORTANTE!!!! conta gli oggetti indipendentemente dal limit!!!
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequest("Please provide all values");
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFound(`No job with id :${jobId}`);
  }

  // check permissions
  checkPermissions(req.user, job.createdBy);

  // 1. findOneAndUpdate
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true, //runValidators controlla solo quello che viene passato in req.body, se non viene passata una proprietà, esso non si accorge dell'errore!
  });

  // 2. save()
  /* need REQUIRED & DEFAULT
    job.position = position
    job.company = company

    await job.save()
  res.status(StatusCodes.OK).json({ job });
  */

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFound(`No job with id :${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Cost removed" });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: "$company" } } }, //il valore dell'_id dipende da che categorie vogliamo creare!
  ]);
  // ARRAY.reduce(accumulator,item)
  //manipolare un array di objects come [{_id:'abc',count:99},etc etc] in un Object {"abc":99}
  stats = stats.reduce((acc, currentItemFromArray) => {
    const { _id: title, count } = currentItemFromArray;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    food: stats.food || 0,
    restaurant: stats.restaurant || 0,
    fun: stats.fun || 0,
    bills: stats.bills || 0,
    others: stats.others || 0,
  };

  let monthlyApplications = [];

  monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: "$company" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, // -1 = DECRESCENTE
    // { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1) //moment count 0 to 11, MongoDB 1 tp 12, quindi arrivano sfasati di 1
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  //NEW

  let monthlyApplicationsDivided = [];

  monthlyApplicationsDivided = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $push: { _id: "$status", cost: "$company" } },
        person: { $push: { _id: "$jobType", cost: "$company" } },
        totalSpending: { $sum: "$company" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, // -1 = DECRESCENTE
    // { $limit: 6 },
  ]);

  monthlyApplicationsDivided = monthlyApplicationsDivided
    .map((item) => {
      const {
        _id: { year, month },
        count,
        person,
        totalSpending,
      } = item;

      const date = moment()
        .month(month - 1) //moment count 0 to 11, MongoDB 1 tp 12, quindi arrivano sfasati di 1
        .year(year)
        .format("MMM Y");

      const totalCount = count.reduce((acc, currentItemFromArray) => {
        const { _id: key, cost } = currentItemFromArray;

        let checkTruthy;
        checkTruthy = acc[key] ? acc[key] : 0;

        acc[key] = cost + checkTruthy;

        return acc;
      }, {});

      const totalCountPerson = person.reduce((acc, currentItemFromArray) => {
        const { _id: key, cost } = currentItemFromArray;

        let checkTruthy;
        checkTruthy = acc[key] ? acc[key] : 0;

        acc[key] = cost + checkTruthy;

        return acc;
      }, {});

      return { date, totalCount, totalCountPerson, totalSpending };
    })
    .reverse();

  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyApplications, monthlyApplicationsDivided });
};

/* 
0:
count: Array(5)
0: {_id: 'food', cost: 20}
1: {_id: 'food', cost: 25}
2: {_id: 'restaurant', cost: 10}
3: {_id: 'food', cost: 15}
4: {_id: 'bills', cost: 23.5}
length: 5
[[Prototype]]: Array(0)
date: "Apr 2022"
person: Array(5)
0: {_id: 'paolo', cost: 20}
1: {_id: 'paolo', cost: 25}
2: {_id: 'paolo', cost: 10}
3: {_id: 'minhye', cost: 15}
4: {_id: 'paolo', cost: 23.5}
*/

const showStatsAlt = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobType", count: { $sum: "$company" } } }, //il valore dell'_id dipende da che categorie vogliamo creare!
  ]);
  // ARRAY.reduce(accumulator,item)
  //manipolare un array di objects come [{_id:'abc',count:99},etc etc] in un Object {"abc":99}
  stats = stats.reduce((acc, currentItemFromArray) => {
    const { _id: title, count } = currentItemFromArray;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    paolo: stats.paolo || 0,
    minhye: stats.minhye || 0,
  };

  let monthlyApplications = [];

  monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: "$company" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, // -1 = DECRESCENTE
    // { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1) //moment count 0 to 11, MongoDB 1 tp 12, quindi arrivano sfasati di 1
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats, showStatsAlt };
