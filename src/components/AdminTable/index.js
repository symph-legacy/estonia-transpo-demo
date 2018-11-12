import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import { trash } from 'react-icons-kit/fa/trash';

class AdminTable extends Component {
  static propTypes = {
    headerColumns: PropTypes.array.isRequired,
    dataRow: PropTypes.array.isRequired,
    onDeleteRow: PropTypes.func.isRequired
  }

  render() {
    const { headerColumns, dataRow, onDeleteRow } = this.props;

    return (
      <Table borderless>
        <thead className="bg-white border-top border-bottom text-uppercase">
          <tr>
            {
              headerColumns.map((header, id) => (
                <th key={`${header}-${id}`}>{header}</th>
              ))
          }
          </tr>
        </thead>
        <tbody>
          {
            dataRow.map(data => (
              <tr key={data.id}>
                <td className="d-flex">
                  <div className="rounded-circle bg-green p-1 mr-2">
                    <Link to={`${this.props.match.url}/${data.id}`} className="text-white">
                      <Icon icon={pencil} />
                    </Link>
                  </div>
                  <button
                    onClick={ (e) => onDeleteRow(data.id, e) }
                    className="rounded-circle bg-red p-1 text-white"
                  >
                    <Icon icon={trash} />
                  </button>
                </td>
                {
                  headerColumns.map((header, id) => (
                    header ? (
                      <td key={data[header]}>
                        {data[header]}
                      </td>
                    ) : null
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export default AdminTable;