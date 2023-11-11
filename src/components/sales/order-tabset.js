import React, {Fragment, useEffect, useState} from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import {toast} from "react-toastify";
import {getApiConfig} from "../../helpers";
import axios from "axios";
import OrderInfoTab from "./order-info";

const OrderTabset = (objectInfo = null) => {
	const [orderStatus, setOrderStatus] = useState(objectInfo.objectInfo?.status);
	const clickActive = (event) => {
		document.querySelector(".nav-link").classList.remove("show");
		event.target.classList.add("show");
	};

	useEffect(() => {
		console.log('objectInfo: ', objectInfo.objectInfo);
	}, [objectInfo]);

	const changeStatus = async (e) => {
		setOrderStatus(e.target.value);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		let response = await axios.patch(`${getApiConfig().baseUrl}/order/${objectInfo.objectInfo?.id}`, {status: orderStatus}, {headers: getApiConfig().headers});
		if (response?.status === 200) {
			toast.success('Comanda a fost salvata cu succes!');
			setTimeout(() => {window.location.href = '/sales/orders'}, 2000);
		} else {
			toast.error('A aparut o eroare la salvarea comenzii!');
		}
	}
	return (
		<Fragment>
			<Tabs>
				<TabList className="nav nav-tabs tab-coupon">
					<Tab className="nav-link" onClick={(e) => clickActive(e)}>
						Administrare
					</Tab>
					<Tab className="nav-link" onClick={(e) => clickActive(e)}>
						Detalii complete
					</Tab>
				</TabList>

				<TabPanel>
					<div className="tab-pane fade active show">
						<Form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
							<h4>Administrare</h4>
							<Row>
								<Col sm="12">
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											Numar de referinta
										</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												id="name"
												name={"name"}
												type="text"
												defaultValue={objectInfo.objectInfo?.webRefNo}
												readOnly={true}
												disabled={true}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Utilizator</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												type="text"
												name={"user"}
												id={"user"}
												defaultValue={`${objectInfo.objectInfo?.user?.fullName} (${objectInfo.objectInfo?.user?.email})`}
												readOnly={true}
												disabled={true}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Data comenzii</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												id="createdAt"
												name={"createdAt"}
												defaultValue={objectInfo.objectInfo?.createdAt}
												type="text"
												readOnly={true}
												disabled={true}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Adresa de livrare</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												type="text"
												name={"deliveryAddress"}
												id={"deliveryAddress"}
												defaultValue={`${objectInfo.objectInfo?.deliveryAddressModel.street}, ${objectInfo.objectInfo?.deliveryAddressModel?.city}`}
												readOnly={true}
												disabled={true}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Adresa de facturare</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												type="text"
												name={"billingAddress"}
												id={"billingAddress"}
												defaultValue={`${objectInfo.objectInfo?.billingAddressModel?.street}, ${objectInfo.objectInfo?.billingAddressModel?.city}`}
												readOnly={true}
												disabled={true}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Status</Label>
										<div className="col-md-7">
											<select onChange={changeStatus} defaultValue={objectInfo.objectInfo?.status} className={"form-control"}>
												<option value="NEW">NOUA</option>
												<option value="PENDING">IN PROCESARE</option>
												<option value="DELIVERY">IN LIVRARE</option>
												<option value="COMPLETED">LIVRATA</option>
											</select>
										</div>
									</div>
								</Col>
							</Row>

							<div className="pull-right">
								<Button type="submit" color="primary">
									Save
								</Button>
							</div>
						</Form>
					</div>
				</TabPanel>
				<TabPanel>
					{objectInfo.objectInfo && <OrderInfoTab order={objectInfo.objectInfo} />}
				</TabPanel>
			</Tabs>
		</Fragment>
	);
};

export default OrderTabset;
