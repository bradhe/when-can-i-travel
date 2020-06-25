import React, { useState } from 'react';
import classnames from 'classnames';
import { Link } from 'gatsby';
import { find, pathSatisfies, reject, equals, uniq, prop, path, map, includes } from 'ramda';
import Select from 'react-select';

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

const selectValues = (opts) => opts ? opts.map(opt => opt.value) : [];

const isFilterMatch = (page, country, filters) => {
  if (filters.region !== '' && filters.region !== country.continent) {
    return false; 
  }

  if (filters.status.length) {
    if (!includes(page.frontmatter.status, filters.status)) {
      return false;
    }
  }

  const { name } = country;
  const countryPrefix = filters.countryPrefix.toLowerCase();

  if (countryPrefix !== '' && name.toLowerCase().indexOf(countryPrefix) !== 0) {
    return false;
  }

  return true;
};

const renderCountryRow = (page, country, states, filters={}) => {
  if (!isFilterMatch(page, country, filters)) {
    return null;
  }

  return (
    <tr key={country.slug}>
      <td className="wcit-country-name">
        <Link to={makePath(country)}>{country.name}</Link>
      </td>
      <td className="wcit-country-region">
        {getRegionName(country.continent)}
      </td>
      <td className="wcit-country-status">
        <span className={findStatusBadgeClassName(page.frontmatter.status, states)}>
          {findStatusLabel(page.frontmatter.status, states)}
        </span>
      </td>
    </tr>
  );
};

const getRegionSelectOptions = (pages, countries) => {
  // we use the pages as a way of looking up countries because we only want to
  // render what we currently have data for.
  const codes = map(path(['frontmatter', 'code']), pages);
  const clean = countries.filter(c => includes(c.code, codes));
  const regions = uniq(map(prop(['continent']), clean));

  return regions.map((region) => {
    return {
      value: region,
      label: getRegionName(region),
    };
  });
};

const findStatusData = (status, states) => find(pathSatisfies(equals(status), ['code']))(states);

const findStatusLabel = (status, states) => prop('label', findStatusData(status, states));

const findStatusColor = (status, states) => prop('color', findStatusData(status, states));

const findStatusBadgeClassName = (status, states) => `badge badge-${findStatusColor(status, states)}`;

const getStatusSelectOptions = (pages, countries, states) => {
  const allStatus = map(path(['frontmatter', 'status']), pages);
  const status = uniq(allStatus);

  return status.map((status) => {
    return {
      value: status,
      label: findStatusLabel(status, states),
    };
  });
};

const getDefaultStatus = (pages, countries, states) => {
  const status = getStatusSelectOptions(pages, countries, states);
  return reject(pathSatisfies(equals('unknown'), ['value']), status);
};

const CountryList = ({ pages, countries, states }) => {
  // we exclude the "unknown" countries for brevity at first. you can drill in
  // if you want.
  const defaultStatus = getDefaultStatus(pages, countries, states);

  const [filters, setFilters] = useState({
    countryPrefix: '',
    region: '',
    status: selectValues(defaultStatus),
  });

  const rows = pages.map((page) => renderCountryRow(page, findCountry(countries, page.frontmatter.code), states, filters));

  const onCountryPrefixChange = (e) => {
    const value = e.target.value;

    const nextFilters = Object.assign({}, filters);
    nextFilters.countryPrefix = value;

    setFilters(nextFilters);
  };

  const onRegionChange = (e) => {
    const value = e ? e.value : '';

    const nextFilters = Object.assign({}, filters);
    nextFilters.region = value;

    setFilters(nextFilters);
  };

  const onStatusChange = (e) => {
    const nextFilters = Object.assign({}, filters);
    nextFilters.status = selectValues(e);

    setFilters(nextFilters);
  };

  return (
    <table className="wcit-country-list table">
      <thead className="thead-light">
        <tr>
          <th className="wcit-country-name">Country</th>
          <th className="wcit-country-region">Region</th>
          <th className="wcit-country-status">Status</th>
        </tr>
        <tr className="wcit-country-list-row">
          <td className="wcit-country-name"><input type="text" className="form-control" onChange={onCountryPrefixChange} placeholder="Search for a country" /></td>
          <td className="wcit-country-region"><Select isClearable onChange={onRegionChange} options={getRegionSelectOptions(pages, countries)} /></td>
          <td className="wcit-country-status"><Select isMulti defaultValue={defaultStatus} onChange={onStatusChange} options={getStatusSelectOptions(pages, countries, states)} /></td>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

export default CountryList;
