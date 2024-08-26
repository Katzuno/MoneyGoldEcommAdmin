import {Table} from 'reactstrap';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {getApiConfig} from "../../helpers";
import Datatable from "../common/datatable";

const OrderInfoTab = ({order}) => {
    const [orderProducts, setOrderProducts] = useState([]); // [ { product: {}, quantity: 1 } ]

    /**
     * Format softone order status response to have CodCS as key
     * Example response: {
     *     "success": true,
     *     "totalcount": 1,
     *     "rows": [
     *         {
     *             "remarks": "MyG_3720779904",
     *             "CodProdus": "3519_14_0_0_0_-1_4_-1_-1_-1_-1_-1",
     *             "QTY": "1",
     *             "Description": "BRATARA",
     *             "TransferId": "8513",
     *             "OrderId": "8514",
     *             "InvoiceId": "0",
     *             "AWB": "-",
     *             "Status": "In curs de procesare"
     *         }
     *     ]
     * }
     * @returns {Promise<void>}
     */
    const formatSoftoneOrderStatus = async () => {
        const softoneOrderStatus = await axios.get(`${getApiConfig().baseUrl}/order/status/${order.webRefNo}`, {headers: getApiConfig().headers});
        if (softoneOrderStatus?.data?.rows) {
            let formattedOrderStatus = {};
            for (let index in softoneOrderStatus.data.rows) {
                formattedOrderStatus[softoneOrderStatus.data.rows[index].CodProdus] = softoneOrderStatus.data.rows[index]['Status'];
            }
            console.log('formattedOrderStatus: ', formattedOrderStatus);
            return formattedOrderStatus;
        }
        return false;
    }
    const getProductsInfo = async () => {
        let localProducts = [];
        const orderProductIds = order.productIds.split(',');
        const orderProductQuantities = order.quantity.split(',');

        const softoneOrderStatus = await formatSoftoneOrderStatus();

        console.log('softoneOrderStatus: ', softoneOrderStatus);

        for (let index in orderProductIds) {
            let response = await axios.get(`${getApiConfig().baseUrl}/articles/${orderProductIds[index]}`, {headers: getApiConfig().headers});
            if (response?.data) {
                delete response.data['images'];
                delete response.data['id'];
                delete response.data['ID_Produs'];
                delete response.data['variants'];
                console.log('response.data: ', response.data['CodCS']);
                console.log('softoneOrderStatus[response.data[\'CodCS\']]: ', softoneOrderStatus[response.data['CodCS']]);
                response.data = {
                    image: <img alt="" src={response.data['Imagine']} style={{width: 100, height: 100}}/>,
                    Nume: response.data['Nume'],
                    SoftoneOrderStatus: softoneOrderStatus[response.data['CodCS']],
                    Cantitate: orderProductQuantities[index],
                    ...response.data
                }
                localProducts.push(response.data);
            }
        }
        setOrderProducts(localProducts);
        console.log(localProducts);
    }

    useEffect(() => {
        getProductsInfo();
    }, [order]);

    return (<>
            <Table striped bordered responsive className="mt-4">
                <thead>
                <tr>
                    <th>Informatii Comanda</th>
                    <th>Informatii Utilizator</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <ul>
                            <li>
                                <strong>Referinta Comanda:</strong> {order.webRefNo}
                            </li>
                            <br/>
                            <li>
                                <strong>Pret:</strong> {order.price} RON
                            </li>
                            <br/>
                            <li>
                                <strong>Status Web:</strong> {order.status}
                            </li>
                            {/* Add more order information as needed */}
                        </ul>
                    </td>
                    <td>
                        <ul>
                            <li>
                                <strong>Email:</strong> {order?.user?.email}
                            </li>
                            <br/>
                            <li>
                                <strong>Nume Complet:</strong> {order?.user?.fullName}
                            </li>
                        </ul>
                    </td>
                </tr>
                </tbody>
                <thead>
                <tr>
                    <th colSpan="2">Adresa de Livrare</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="2">
                        <address>
                            {order.deliveryAddressModel.street}, {order.deliveryAddressModel.city}, {order.deliveryAddressModel.state}
                        </address>
                    </td>
                </tr>
                </tbody>
                <thead>
                <tr>
                    <th colSpan="2">Adresa de Facturare</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="2">
                        <address>
                            {order.billingAddressModel.street}, {order.billingAddressModel.city}, {order.billingAddressModel.state}
                        </address>
                    </td>
                </tr>
                </tbody>
            </Table>

            <h3> Linii de comanda </h3>
            <div
                id="batchDelete"
                className="category-table order-table coupon-list-delete"
            >
                {orderProducts.length > 0 && (
                    <Datatable
                        multiSelectOption={false}
                        myData={orderProducts}
                        pageSize={10}
                        pagination={true}
                        class="-striped -highlight"
                        objectType={'product'}
                    />
                )}
            </div>
        </>
    );
};

export default OrderInfoTab;
