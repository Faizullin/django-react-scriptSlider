import React from 'react'

interface IScriptTableProps{

}

const ScriptTable = (props: IScriptTableProps) => {
    const columns = React.useMemo(
        () => [
            {
            Header: 'Name',
            columns: [
                {
                Header: 'First Name',
                accessor: 'firstName',
                },
                {
                Header: 'Last Name',
                accessor: 'lastName',
                },
            ],
            },
            {
            Header: 'Info',
            columns: [
                {
                Header: 'Age',
                accessor: 'age',
                },
                {
                Header: 'Visits',
                accessor: 'visits',
                },
                {
                Header: 'Status',
                accessor: 'status',
                },
                {
                Header: 'Profile Progress',
                accessor: 'progress',
                },
            ],
            },
        ],
        []
    )
    // const data = React.useMemo(() => makeData(20), [])
    return (
        <div>ScriptTable</div>
    )
}

export default ScriptTable