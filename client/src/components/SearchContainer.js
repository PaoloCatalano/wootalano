import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";
//NEW
import { useState, useMemo } from "react";

const SearchContainer = () => {
  //NEW
  const [localSearch, setLocalSearch] = useState("");

  const {
    isLoading,
    /* search, */
    searchCompany,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    handleChange,
    clearFilters,
    jobTypeOptions,
    statusOptions,
  } = useAppContext();

  const handleSearch = (e) => {
    /*     if (isLoading) return;
     */ handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };

  //NEW DEBOUNCE
  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 1000);
    };
  };
  const memoDebounce = useMemo(() => debounce(), []);

  return (
    <Wrapper>
      <form className="form" autoComplete="off">
        <h4>search form</h4>
        <div className="form-center">
          {/* search position */}
          <FormRow
            type="text"
            name="search"
            labelText="Where you spent"
            /*             value={search}
              handleChange={handleSearch}
             */
            value={localSearch}
            handleChange={memoDebounce}
          />

          {/* search company */}
          <FormRow
            type="number"
            name="searchCompany"
            labelText="Minimum Cost"
            value={searchCompany}
            handleChange={handleSearch}
          />

          {/* search by status */}
          <FormRowSelect
            labelText="Type of spending"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          {/* search by type */}
          <FormRowSelect
            labelText="Who spent"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          {/* sort */}
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
