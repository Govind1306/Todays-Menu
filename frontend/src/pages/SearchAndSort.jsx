import React from "react";
import "./SearchAndSort.css";

const SearchAndSort = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <div className="search-sort-container">
      <input
        type="text"
        placeholder="Search eatery by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="rating">Sort by Rating</option>
        <option value="name">Sort by Name</option>
      </select>
    </div>
  );
};

export default SearchAndSort;
