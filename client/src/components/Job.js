import moment from "moment";
import { FaLocationArrow, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  status,
}) => {
  const { setEditJob, deleteJob } = useAppContext();

  let date = moment(createdAt);
  date = date.format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div
          className="main-icon"
          style={
            jobType === "minhye"
              ? {
                  background: "#C599FF",
                  color: "#7400CC",
                }
              : {}
          }
        >
          {jobType.charAt(0)}
        </div>
        <div className="info">
          <h5>{position}</h5>
          <p>€ {Number(company).toFixed(2)}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <div className={`status ${status}`}> {status}</div>
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-spending"
              className="btn edit-btn"
              onClick={() => setEditJob(_id)}
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
