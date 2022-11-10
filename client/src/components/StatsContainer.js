import { useAppContext } from "../context/appContext";
import StatItem from "./StatItem";
import { FaDice, FaFileInvoiceDollar, FaPlaystation } from "react-icons/fa";
import { MdFastfood, MdRestaurant } from "react-icons/md";
import { GiClothes, GiCat } from "react-icons/gi";
import Wrapper from "../assets/wrappers/StatsContainer";

const StatsContainer = () => {
  const { stats, statsAlt, monthlyApplications } = useAppContext();

  // const totalMonths = monthlyApplications.length;
  // settembre e ottobre non hanno dati completi, quindi opto per un valore medio di 6 mesi e mezzo.
  const totalMonths = 6.5;

  const defaultStats = [
    {
      title: "food",
      count: stats.food || 0,
      icon: <MdFastfood />,
      color: "#e9b949",
      bcg: "#fcefc7",
    },
    {
      title: "restaurant",
      count: stats.restaurant || 0,
      icon: <MdRestaurant />,
      color: "#647acb",
      bcg: "#e0e8f9",
    },
    {
      title: "fun",
      count: stats.fun || 0,
      icon: <FaDice />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
    {
      title: "bills",
      count: stats.bills || 0,
      icon: <FaFileInvoiceDollar />,
      color: "#107181",
      bcg: "#5dbecd",
    },
    {
      title: "others",
      count: stats.others || 0,
      icon: <GiClothes />,
      color: "#168d6a",
      bcg: "#a6e9d5",
    },
  ];

  const defaultStatsAlt = [
    {
      title: "paolo",
      count: statsAlt.paolo || 0,
      icon: <FaPlaystation />,
      color: "#b69121",
      bcg: "#ffe169",
    },
    {
      title: "minhye",
      count: statsAlt.minhye || 0,
      icon: <GiCat />,
      color: "#7400CC",
      bcg: "#C599FF",
    },
  ];

  return (
    <>
      <div style={{ marginTop: "3rem" }}>
        <h3>6 MONTHS AVERAGE</h3>
      </div>

      <Wrapper>
        {defaultStats.map((item, index) => {
          return <StatItem key={index} {...item} total={totalMonths} />;
        })}
        <div style={{ height: 50 }}></div>

        {defaultStatsAlt.map((item, index) => {
          return <StatItem key={index} {...item} total={totalMonths} />;
        })}
      </Wrapper>
    </>
  );
};

export default StatsContainer;
