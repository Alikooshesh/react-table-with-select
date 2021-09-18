import React, {useEffect, useState} from 'react'
import axios from "axios";
import styled from 'styled-components'
import { useTable, useRowSelect } from 'react-table'


const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)

function App() {

    const [tableData , setTableData] = useState([])
    const [page , setPage] = useState()
    const [selectedCells , setSelectedCells] = useState([])

    const axiosConfig = {
        headers: {
            'app-id': '614567db620bcb9656f3808b',
        }
    }

    useEffect(()=>{setPage(1)},[])

    useEffect(()=>{
        axios.get(`https://dummyapi.io/data/v1/user?page=${page}&limit=10`,axiosConfig)
            .then(data => {
                setTableData([data.data.data.map(item => {
                    return {
                        id : item.id,
                        FName : item.firstName,
                        LName : item.lastName
                    }
                })])
            })
            .catch(err => console.log(err))
    },[page])

    const data = React.useMemo(
        () => tableData[0] ? [...tableData[0]] : [],
        [tableData]
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'First Name',
                accessor: 'FName',
            },
            {
                Header: 'Last Name',
                accessor: 'LName',
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state: { selectedRowIds },
    } = useTable(
        {
            columns,
            data,
        },
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    )

    const pageHandle = (dir)=>{
        setSelectedCells([...selectedCells ,
            ...selectedFlatRows.map(d => d.original)
        ])

        dir === 0 && page >= 0 && setPage(page - 1)
        dir === 1 && setPage(page + 1)
    }

    return (
        <>
            {console.log(selectedCells)}
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.slice(0, 10).map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>

            <button onClick={()=> pageHandle(0)}>previous page</button>
            <button onClick={()=> pageHandle(1)}>next page</button>
        </>
    )
}

export default App
