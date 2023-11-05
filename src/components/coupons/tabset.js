import React, {Fragment, useEffect, useState} from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import {getApiConfig} from "../../helpers";
import axios from "axios";
import {toast} from "react-toastify";

const Tabset = (objectInfo = null) => {
	const [startDate, setstartDate] = useState(new Date());
	const [endDate, setendDate] = useState(new Date());

	const handleStartDate = (date) => {
		setstartDate(date);
	};

	const handleEndDate = (date) => {
		setendDate(date);
	};

	const clickActive = (event) => {
		document.querySelector(".nav-link").classList.remove("show");
		event.target.classList.add("show");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		// Convert FormData to a plain object
		let formObject = {};
		formData.forEach((value, key) => {
			formObject[key] = value;
		});

		formObject['isActive'] = formObject['isActive'] === 'on';

		console.log(formObject);
		let response;

		if (objectInfo?.objectInfo?.id)	{
			response = await axios.put(`${getApiConfig().baseUrl}/promotions/${objectInfo.objectInfo.id}`, formObject, {headers: getApiConfig().headers});
		} else {
			response = await axios.post(`${getApiConfig().baseUrl}/promotions`, formObject, {headers: getApiConfig().headers});
		}

		if (response.status === 201 || response.status === 200) {
			toast.success('Promotia a fost salvata cu succes!');
			setTimeout(() => {window.location.href = '/coupons/list-coupons'}, 2000);
		} else {
			toast.error('A aparut o eroare la salvarea promotiei!');
		}
	}

	return (
		<Fragment>
			<Tabs>
				<TabList className="nav nav-tabs tab-coupon">
					<Tab className="nav-link" onClick={(e) => clickActive(e)}>
						General
					</Tab>
					{/*<Tab className="nav-link" onClick={(e) => clickActive(e)}>*/}
					{/*	Restriction*/}
					{/*</Tab>*/}
					{/*<Tab className="nav-link" onClick={(e) => clickActive(e)}>*/}
					{/*	Usage*/}
					{/*</Tab>*/}
				</TabList>

				<TabPanel>
					<div className="tab-pane fade active show">
						<Form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
							<h4>General</h4>
							<Row>
								<Col sm="12">
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Nume
										</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												id="name"
												name={"name"}
												type="text"
												defaultValue={objectInfo.objectInfo?.name}
												required=""
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">
											<span>*</span> Voucher
										</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												id="voucherCode"
												name={"voucherCode"}
												defaultValue={objectInfo.objectInfo?.voucherCode}
												type="text"
												required=""
											/>
										</div>
										<div className="valid-feedback">
											Please Provide a Valid Coupon Code.
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Start Date</Label>
										<div className="col-md-7">
											<DatePicker
												selected={startDate}
												startDate={ startDate}
												name={"startDate"}
												id={"startDate"}
												onChange={handleStartDate}
												defaultValue={objectInfo.objectInfo?.startDate}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">End Date</Label>
										<div className="col-md-7">
											<DatePicker
												selected={endDate}
												endDate={endDate}
												name={"endDate"}
												id={"endDate"}
												onChange={handleEndDate}
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Descriere</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												type="text"
												name={"description"}
												id={"description"}
												defaultValue={objectInfo.objectInfo?.description}
												required=""
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Procent discount (%)</Label>
										<div className="col-md-7">
											<Input
												className="form-control"
												type="number"
												name={"discount"}
												id={"discount"}
												defaultValue={objectInfo.objectInfo?.discount}
												required=""
											/>
										</div>
									</div>
									<div className="form-group row">
										<Label className="col-xl-3 col-md-4">Status</Label>
										<div className="col-md-7">
											<Label className="d-block">
												<Input
													className="checkbox_animated"
													id="isActive"
													name="isActive"
													defaultChecked={objectInfo.objectInfo?.isActive}
													type="checkbox"
												/>
												Activeaza pe loc
											</Label>
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
				{/*<TabPanel>*/}
				{/*	<Form className="needs-validation" noValidate="">*/}
				{/*		<h4>Restriction</h4>*/}
				{/*		<div className="form-group row">*/}
				{/*			<Label className="col-xl-3 col-md-4">Products</Label>*/}
				{/*			<div className="col-md-7">*/}
				{/*				<Input*/}
				{/*					className="form-control"*/}
				{/*					id="validationCustom3"*/}
				{/*					type="text"*/}
				{/*					required=""*/}
				{/*				/>*/}
				{/*			</div>*/}
				{/*			<div className="valid-feedback">*/}
				{/*				Please Provide a Product Name.*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*		<div className="form-group row">*/}
				{/*			<Label className="col-xl-3 col-md-4">Category</Label>*/}
				{/*			<div className="col-md-7">*/}
				{/*				<select className="form-select" required="">*/}
				{/*					<option value="">--Select--</option>*/}
				{/*					<option value="1">Electronics</option>*/}
				{/*					<option value="2">Clothes</option>*/}
				{/*					<option value="2">Shoes</option>*/}
				{/*					<option value="2">Digital</option>*/}
				{/*				</select>*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*		<div className="form-group row">*/}
				{/*			<Label className="col-xl-3 col-md-4">Minimum Spend</Label>*/}
				{/*			<div className="col-md-7">*/}
				{/*				<Input*/}
				{/*					className="form-control"*/}
				{/*					id="validationCustom4"*/}
				{/*					type="number"*/}
				{/*				/>*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*		<div className="form-group row">*/}
				{/*			<Label className="col-xl-3 col-md-4">Maximum Spend</Label>*/}
				{/*			<div className="col-md-7">*/}
				{/*				<Input*/}
				{/*					className="form-control"*/}
				{/*					id="validationCustom5"*/}
				{/*					type="number"*/}
				{/*				/>*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*	</Form>*/}
				{/*</TabPanel>*/}
				{/*<TabPanel>*/}
				{/*	<Form className="needs-validation" noValidate="">*/}
				{/*		<h4>Usage Limits</h4>*/}
				{/*		<div className="form-group row">*/}
				{/*			<Label className="col-xl-3 col-md-4">Per Limit</Label>*/}
				{/*			<div className="col-md-7">*/}
				{/*				<Input*/}
				{/*					className="form-control"*/}
				{/*					id="validationCustom6"*/}
				{/*					type="number"*/}
				{/*				/>*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*		<div className="form-group row">*/}
				{/*			<Label className="col-xl-3 col-md-4">Per Customer</Label>*/}
				{/*			<div className="col-md-7">*/}
				{/*				<Input*/}
				{/*					className="form-control"*/}
				{/*					id="validationCustom7"*/}
				{/*					type="number"*/}
				{/*				/>*/}
				{/*			</div>*/}
				{/*		</div>*/}
				{/*	</Form>*/}
				{/*</TabPanel>*/}
			</Tabs>
		</Fragment>
	);
};

export default Tabset;
