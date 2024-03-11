import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../common/breadcrumb";
import Datatable from "../common/datatable";
import {Button, Card, CardBody, CardHeader, Col, Container, Input, Row} from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const Orders = ({}) => {
	const [orders, setOrders] = React.useState([]);
	const [searchRefNo, setSearchRefNo] = useState('');
	const [searchClient, setSearchClient] = useState('');
	const [startDate, setStartDate] = useState('01/01/2000');
	const [endDate, setEndDate] = useState('01/01/2400');
	const [forceUpdate, setForceUpdate] = useState(false);

	const getOrders = async () => {
		const response = await axios.get(`${getApiConfig().baseUrl}/order?startDate=${startDate}&endDate=${endDate}&refNo=${searchRefNo}&email=${searchClient}`, {headers: getApiConfig().headers});
		if (response?.data) {
			for (let index in response.data) {
				delete response.data[index]['orderNumber'];
				delete response.data[index]['productIds'];
				delete response.data[index]['quantity'];
				delete response.data[index]['userId'];
				delete response.data[index]['deliveryAddress'];
				delete response.data[index]['billingAddress'];
				const deliveryAddress = response.data[index]['deliveryAddressModel'];
				const billingAddress = response.data[index]['billingAddressModel'];
				const promotion = response.data[index]['promotion'];

				delete response.data[index]['deliveryAddressModel'];
				delete response.data[index]['billingAddressModel'];
				delete response.data[index]['promotion'];
				delete response.data[index]['promotionId'];

				if (response.data[index]['paymentType'] == 1) {
					response.data[index]['paymentType'] = 'Numerar';
				} else {
					response.data[index]['paymentType'] = 'Card';
				}
				response.data[index] = {
					id: response.data[index]['id'],
					webRefNo: response.data[index]['webRefNo'],
					deliveryAddress: deliveryAddress?.street + ', ' + deliveryAddress?.city,
					billingAddress: billingAddress?.street + ', ' + billingAddress?.city,
					promotion: `${promotion?.voucherCode} (${promotion?.discount})`,
					price: response.data[index]['price'] + ' RON',
					...response.data[index]
				}
			}
			setOrders(prevOrders => {
				// Create a new array with the changes
				const newOrders = response.data;
				return newOrders;
			});
			// setForceUpdate(prevState => !prevState);
		}
	}

	useEffect(() => {
		getOrders();
	}, []);

	useEffect(() => {
		getOrders();
	}, [searchRefNo, searchClient, startDate, endDate]);


	useEffect(() => {
		setForceUpdate(prevState => !prevState);
	}, [orders]);

	return (
		<Fragment>
			<Breadcrumb title="Orders" parent="Sales" />

			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Manage Order</h5>
							</CardHeader>
							<CardBody className="order-datatable">
								<Input
									required=""
									name="refNo"
									id={"refNo"}
									type="text"
									className="form-control"
									style={{width: '40%', display: 'inline'}}
									onChange={(e) => setSearchRefNo(e.target.value)}
									placeholder="Cauta dupa referinta"
								/>
								<Input
									required=""
									name="email"
									id={"email"}
									type="text"
									className="form-control"
									style={{width: '40%', marginLeft: '1vw', display: 'inline'}}
									onChange={(e) => setSearchClient(e.target.value)}
									placeholder="Cauta dupa client"
								/>
								<br/>
								<br/>

								<Input
									required=""
									name="startDate"
									id={"startDate"}
									type="date"
									className="form-control"
									style={{width: '40%', marginLeft: '1vw', display: 'inline'}}
									onChange={(e) => setStartDate(e.target.value)}
									placeholder="Data inceput"
								/>

								<Input
									required=""
									name="endDate"
									id={"endDate"}
									type="date"
									className="form-control"
									style={{width: '40%', marginLeft: '1vw', display: 'inline'}}
									onChange={(e) => setEndDate(e.target.value)}
									placeholder="Data sfarsit"
								/>

								<br/>
								<br/>
								{ forceUpdate && <Datatable
									multiSelectOption={false}
									myData={orders}
									pageSize={10}
									pagination={true}
									class="-striped -highlight"
									objectType={'order'}
								/>}
								{ !forceUpdate && <Datatable
									multiSelectOption={false}
									myData={orders}
									pageSize={10}
									pagination={true}
									class="-striped -highlight"
									objectType={'order'}
								/>}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Orders;
