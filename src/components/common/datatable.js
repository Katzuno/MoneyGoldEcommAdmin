import React, { Fragment, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from "reactstrap";
import {getApiConfig} from "../../helpers";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Datatable = ({ myData, myClass, multiSelectOption, pagination, objectType='', onDataChange, onRefresh }) => {
	const [open, setOpen] = useState(false);
	const [checkedValues, setCheckedValues] = useState([]);
	const [data, setData] = useState(myData);

	const navigate = useNavigate();
	const selectRow = (e, i) => {
		if (!e.target.checked) {
			setCheckedValues(checkedValues.filter((item, j) => i !== item));
		} else {
			checkedValues.push(i);
			setCheckedValues(checkedValues);
		}
	};


	const handleRemoveRow = async (rowId) => {
		if (!rowId) {
			console.log('checkedValues', checkedValues);
			rowId = checkedValues;
			return;
		}

		const updatedData = myData.filter(function (el) {
			return checkedValues.indexOf(el.id) < 0;
		});
		let response = {};

		console.log(objectType, 'removeRow');
		if (objectType === 'promotion') {
			response = await axios.delete(`${getApiConfig().baseUrl}/promotions/${rowId}`, {headers: getApiConfig().headers});
		}
		if (objectType === 'product') {
			response = await axios.delete(`${getApiConfig().baseUrl}/articles/${rowId}`, {headers: getApiConfig().headers});
		}
		if (objectType === 'order') {
			response = await axios.delete(`${getApiConfig().baseUrl}/order/${rowId}`, {headers: getApiConfig().headers});
		}
		if (objectType === 'user') {
			response = await axios.delete(`${getApiConfig().baseUrl}/users/${rowId}`, {headers: getApiConfig().headers});
		}
		if (objectType === 'store') {
			response = await axios.delete(`${getApiConfig().baseUrl}/store/${rowId}`, {headers: getApiConfig().headers});
		}
		if (response?.status === 200 || response?.status === 204) {
			// If onRefresh callback is provided, use it to refetch data from server
			if (onRefresh) {
				onRefresh();
			} else {
				// Fallback to local state update
				setData([...updatedData]);
				if (onDataChange) {
					onDataChange([...updatedData]);
				}
			}
			toast.success("Stergere efectuata cu success !");
		}
	};

	const handleEditRedirect = async (rowId) => {
		if (objectType === 'promotion') {
			navigate(`/coupons/create-coupons?id=${rowId}`);
		}
		if (objectType === 'product') {
			navigate(`/products/add-product?id=${rowId}`);
		}
		if (objectType === 'order') {
			navigate(`/sales/order-detail?id=${rowId}`);
		}
		if (objectType === 'translation') {
			navigate(`/pages/create-page?id=${rowId}`);
		}
		if (objectType === 'media') {
			navigate(`/media/edit-media?id=${rowId}`);
		}
		if (objectType === 'store') {
			navigate(`/stores/edit-store?id=${rowId}`);
		}
	};

	const renderEditable = (cellInfo) => {
		return (
			<div
				style={{ backgroundColor: "#fafafa" }}
				contentEditable
				suppressContentEditableWarning
				onBlur={(e) => {
					data[cellInfo.index][cellInfo.index.id] = e.target.innerHTML;
					setData({ myData: data });
				}}
				dangerouslySetInnerHTML={{
					__html: myData[cellInfo.index][cellInfo.index.id],
				}}
			/>
		);
	};

	const handleDelete = (index) => {
		if (window.confirm("Are you sure you wish to delete this item?")) {
			const del = data;
			del.splice(index, 1);
			setData([...del]);
		}
		toast.success("Successfully Deleted !");
	};
	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false);
	};

	const Capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const columns = [];
	if (!myData || myData.length === 0) {
		return (
			<div className="text-center p-4">
				No data available
			</div>
		);
	}
	for (const key in myData[0]) {
		let editable = renderEditable;
		if (key === "image") {
			editable = null;
		}
		if (key === "status") {
			editable = null;
		}
		if (key === "avtar") {
			editable = null;
		}
		if (key === "vendor") {
			editable = null;
		}
		if (key === "order_status") {
			editable = null;
		}

		columns.push({
			name: <b>{Capitalize(key.toString())}</b>,
			header: <b>{Capitalize(key.toString())}</b>,
			selector: row => row[key],
			Cell: editable,
			style: {
				textAlign: "center",
			},
		});
	}

	if (multiSelectOption === true) {
		columns.push({
			name: (
				<button
					className="btn btn-danger-gradien btn-sm mb-0 b-r-4"
					onClick={(e) => {
						if (window.confirm("Are you sure you wish to delete this item?"))
							handleRemoveRow();
					}}
				>
					Delete
				</button>
			),
			id: "delete",
			accessor: (str) => "delete",
			cell: (row) => (
				<div>
					<span>
						<input
							type="checkbox"
							name={row.id}
							defaultChecked={checkedValues.includes(row.id)}
							onChange={(e) => selectRow(e, row.id)}
						/>
					</span>
				</div>
			),
			style: {
				textAlign: "center",
			},
			sortable: false,
		});
	} else {
		columns.push({
			name: <b>Action</b>,
			id: "delete",
			accessor: (str) => "delete",
			cell: (row, index) => (
				<div>
					<span onClick={() => handleRemoveRow(row.id)}>
						<i
							className="fa fa-trash"
							style={{
								width: 35,
								fontSize: 20,
								padding: 11,
								color: "#e4566e",
							}}
						></i>
					</span>

					<span>
						<i
							onClick={() => handleEditRedirect(row.id)}
							className="fa fa-pencil"
							style={{
								width: 35,
								fontSize: 20,
								padding: 11,
								color: "rgb(40, 167, 69)",
							}}
						></i>
						<Modal
							isOpen={open}
							toggle={onCloseModal}
							style={{ overlay: { opacity: 0.1 } }}
						>
							<ModalHeader toggle={onCloseModal}>
								<h5 className="modal-title f-w-600" id="exampleModalLabel2">
									Edit Product
								</h5>
							</ModalHeader>
							<ModalBody>
								<Form>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Category Name :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="message-text" className="col-form-label">
											Category Image :
										</Label>
										<Input
											className="form-control"
											id="validationCustom02"
											type="file"
										/>
									</FormGroup>
								</Form>
							</ModalBody>
							<ModalFooter>
								<Button
									type="button"
									color="primary"
									onClick={() => onCloseModal("VaryingMdo")}
								>
									Update
								</Button>
								<Button
									type="button"
									color="secondary"
									onClick={() => onCloseModal("VaryingMdo")}
								>
									Close
								</Button>
							</ModalFooter>
						</Modal>
					</span>
				</div>
			),
			style: {
				textAlign: "center",
			},
			sortable: false,
		});
	}
	return (
		<div>
			<Fragment>
				<DataTable
					data={data}
					columns={columns}
					className={myClass}
					pagination={pagination}
					striped={true}
					center={true}
					responsive={true}
					keyField={"id"}
				/>

				<ToastContainer />
			</Fragment>
		</div>
	);
};

export default Datatable;
