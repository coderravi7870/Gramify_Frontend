import React from 'react'
import Search from "../../component/Search/Search"
import HomeSideBar from "../../component/Home/HomeSideBar"

const SearchPage = () => {
    return (
        <div className="flex w-full">
          <HomeSideBar />
          <div className="w-full">
            <Search />
          </div>
        </div>
      );
}

export default SearchPage