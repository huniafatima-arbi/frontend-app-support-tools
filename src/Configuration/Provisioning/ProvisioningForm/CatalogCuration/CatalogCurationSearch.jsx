import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { SearchData, SearchHeader } from '@edx/frontend-enterprise-catalog-search';
import { useContextSelector } from 'use-context-selector';

import { useEffect, useState } from 'react';
import { configuration } from './data/config';
import { CatalogCurationContext } from './CatalogCurationContext';
import CatalogCurationDateSelection from './CatalogCurationDateSelection';
import CatalogCurationSelectContentDataTable from './CatalogCurationSelectContentDataTable';
import useCatalogCurationContext from './data/hooks';

const CatalogCurationSearch = () => {
  const {
    searchClient,
    defaultSearchFilter,
    currentSearchFilter,
    currentSelectedRowIds,
    startDate,
    endDate,
  } = useContextSelector(CatalogCurationContext, v => v[0]);
  const { setCurrentSelectedRowIds, setCurrentSearchFilter } = useCatalogCurationContext();
  const [currentSearchFilterValue, setCurrentSearchFilterValue] = useState(defaultSearchFilter);

  useEffect(() => {
    // check to see if one date is not null
    if (startDate !== '' || endDate !== '') {
      setCurrentSearchFilter({ currentSearchFilter: { content_type: 'course' } });
      let placeholderString = ``;
      for (let [key, value] of Object.entries({ content_type: 'course' })) {
        placeholderString = placeholderString + ` AND ${key}:${value}`;
      };
      setCurrentSearchFilterValue(defaultSearchFilter + placeholderString);
      // set to have contentType = course
    } else {
      setCurrentSearchFilter({ currentSearchFilter: {} });
      setCurrentSearchFilterValue(defaultSearchFilter);
    }
  }, [startDate, endDate]);
  return (
    <SearchData>
      <InstantSearch
        indexName={configuration.ALGOLIA.INDEX_NAME}
        searchClient={searchClient}
      >
        <Configure
          filters={currentSearchFilterValue}
          hitsPerPage={500}
        />
        <SearchHeader variant="default" />
        <CatalogCurationDateSelection />
        <CatalogCurationSelectContentDataTable
          selectedRowIds={currentSelectedRowIds}
          onSelectedRowsChanged={setCurrentSelectedRowIds}
        />
      </InstantSearch>
    </SearchData>
  );
};

export default CatalogCurationSearch;
