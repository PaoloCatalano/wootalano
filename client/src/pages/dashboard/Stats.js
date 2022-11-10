import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import {
  StatsContainer,
  Loading,
  ChartsContainer,
  StatsContainerMonthly,
} from "../../components";

const Stats = () => {
  const { showStats, showStatsAlt, isLoading, monthlyApplications } =
    useAppContext();

  useEffect(() => {
    showStats();
    showStatsAlt();
    // eslint-disable-next-line
  }, []);
  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <StatsContainerMonthly />
      {monthlyApplications.length > 0 && <ChartsContainer />}
      <StatsContainer />
    </>
  );
};

export default Stats;
