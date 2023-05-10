import React from 'react'
import { useState } from 'react';
import { Button, Table } from 'react-bootstrap'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'


export default function Datatable(props) {
    const tableInstance = useTable({
          columns: props.col,
          data: props.data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
      );
      
      const {
        getTableProps, // table props from react-table
        headerGroups, // headerGroups, if your table has groupings
        getTableBodyProps, // table body props from react-table
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter,
        page, // use, page or rows
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
      } = tableInstance;
      
      const { globalFilter, pageIndex, pageSize } = state;
  return (
    <>
        <div className="table-responsive">
            <div className="e-table px-5 pb-5 table-responsive">
                <div className="d-flex">
                    <select className="mb-4 table-border me-1" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        {[10, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                    <GlobalResFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
                <Table className="table table-bordered text-nowrap border-bottom table-sm">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            className={column.className}
                            >
                            <span className="tabletitle">{column.render("Header")}</span>
                            <span>
                                {column.isSorted ? (
                                column.isSortedDesc ? (
                                    <i className="fa fa-angle-down"></i>
                                ) : (
                                    <i className="fa fa-angle-up"></i>
                                )
                                ) : (
                                ""
                                )}
                            </span>
                            </th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {
                        page.length > 0 ? page.map((row) => {
                        prepareRow(row);
                        return (
                        <tr className="text-center" {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                            return (
                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                            );
                            })}
                        </tr>
                        );
                    }) : <td className="text-center" colSpan="3">No Data Found</td>
                    }
                    </tbody>
                </Table>
                <div className="d-block d-sm-flex mt-4 ">
                    <span className="">Page{" "}
                    <strong>{pageIndex + 1} of {pageOptions.length}</strong>{" "}
                    </span>
                    <span className="ms-sm-auto ">
                    <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-2 d-sm-inline d-block"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {" Previous "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-2"
                        onClick={() => {
                        previousPage();
                        }}
                        disabled={!canPreviousPage}
                    >
                        {" < "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-2"
                        onClick={() => {
                        nextPage();
                        }}
                        disabled={!canNextPage}
                    >
                        {" > "}
                    </Button>
                    <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-2"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {" Next "}
                    </Button>
                    </span>
                </div>
            </div>
        </div> 
    </>
  )
}


const GlobalResFilter = ({ filter, setFilter }) => {
    return (
      <span className="d-flex ms-auto">
        <input
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control mb-4"
          placeholder="Search..."
        />
      </span>
    );
  };