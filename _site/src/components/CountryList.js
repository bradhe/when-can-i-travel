import React, { useState } from 'react';
import { Link } from 'gatsby';
import { uniq, prop, path, map, includes } from 'ramda';

const first = (arr) => arr.length && arr.length > 0 && arr[0];

const findCountry = (countries, code) => first(countries.filter((c) => c.code === code));

const getRegionName = (region) => {
  switch (region) {
  case 'AS':
    return 'Asia';
  case 'AF':
    return 'Africa';
  case 'EU':
    return 'Europe';
  case 'OC':
    return 'Oceania';
  case 'NA':
    return 'North America';
  case 'SA':
    return 'South America';
  };
};


const makePath = (country) => `/to/${country.slug}/`;

const isFilterMatch = (page, country, filters) => {
  if (filters.region !== '' && filters.region !== country.continent) {
    return false; 
  }

  if (filters.status !== '' && filters.status !== page.frontmatter.status) {
    return false;
  }

  const { name } = country;
  const countryPrefix = filters.countryPrefix.toLowerCase();

  if (countryPrefix !== '' && name.toLowerCase().indexOf(countryPrefix) !== 0) {
    return false;
  }

  return true;
};

const renderCountryRow = (page, country, filters={}) => {
  if (!isFilterMatch(page, country, filters)) {
    return null;
  }

  return (
    <tr key={country.slug}>
      <td>
        <Link to={makePath(country)}>{country.name}</Link>
      </td>
      <td>
        {getRegionName(country.continent)}
      </td>
      <td>
        {page.frontmatter.status}
      </td>
    </tr>
  );
};

const renderRegionSelectOptions = (pages, countries) => {
  const options = [];
  options.push(<option value="">Filter region</option>);

  // we use the pages as a way of looking up countries because we only want to
  // render what we currently have data for.
  const codes = map(path(['frontmatter', 'code']), pages);
  const clean = countries.filter(c => includes(c.code, codes));
  const regions = uniq(map(prop(['continent']), clean));

  regions.forEach((region) => {
    options.push(<option value={region}>{getRegionName(region)}</option>);
  });

  return options;
};

const renderStatusSelectOptions = (pages, countries) => {
  const options = [];
  options.push(<option value="">Filter status</option>);

  const allStatus = map(path(['frontmatter', 'status']), pages);
  const status = uniq(allStatus);

  status.forEach((status) => {
    options.push(<option value={status}>{status}</option>);
  });

  return options;
};

const CountryList = ({ pages, countries}) => {
  const [filters, setFilters] = useState({
    countryPrefix: '',
    region: '',
    status: '',
  });

  const rows = pages.map((page) => {
    return renderCountryRow(page, findCountry(countries, page.frontmatter.code), filters);
  });

  const onCountryPrefixChange = (e) => {
    const value = e.target.value;

    const nextFilters = Object.assign({}, filters);
    nextFilters.countryPrefix = value;

    setFilters(nextFilters);
  };

  const onRegionChange = (e) => {
    const value = e.target.value;

    const nextFilters = Object.assign({}, filters);
    nextFilters.region = value;

    setFilters(nextFilters);
  };

  const onStatusChange = (e) => {
    const value = e.target.value;

    const nextFilters = Object.assign({}, filters);
    nextFilters.status = value;

    setFilters(nextFilters);
  };

  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th>Country</th>
          <th>Region</th>
          <th>Status</th>
        </tr>
        <tr>
          <td><input type="text" className="form-control" onChange={onCountryPrefixChange} placeholder="Search for a country" /></td>
          <td><select className="custom-select" onChange={onRegionChange}>{renderRegionSelectOptions(pages, countries)}</select></td>
          <td><select className="custom-select" onChange={onStatusChange}>{renderStatusSelectOptions(pages, countries)}</select></td>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

export default CountryList;
