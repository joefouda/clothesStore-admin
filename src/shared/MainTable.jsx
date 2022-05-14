import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TableFooter from '@material-ui/core/TableFooter'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable(props) {
    const [actionDisplay, setActionDisplay] = useState(false)
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const columns = props.info.tableHeaders.map(ele => {
        const toCamelCase = (str = '') => {
            return str
               .replace(/[^a-z0-9]/gi, ' ')
               .toLowerCase()
               .split(' ')
               .map((el, ind) => ind === 0 ? el : el[0].toUpperCase() + el.substring(1, el.length))
               .join('');
         };
        return { id: toCamelCase(ele), label: ele }
    })
    const [rows] = useState(()=>[...props.info.data]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        props.info.header !== 'Orders' && props.info.header !== 'Users' ? setActionDisplay(true) : setActionDisplay(false)
    }, [props.info.header])
    return (
        <>
            <Typography variant="h3" style={{ marginBottom: 10,color:'#f3f7ff' }}>
                {props.info.header}
            </Typography>
            <Divider />
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {actionDisplay ? <TableFooter style={{ display: 'flex' }}>
                    <Button
                        style={{ flexGrow: 1 }}
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add new {props.info.dataFor}
                    </Button>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="span"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableFooter> :
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="span"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />}
            </Paper>
        </>
    );
}
