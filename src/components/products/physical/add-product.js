import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../../common/breadcrumb";
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Row,
	Button,
} from "reactstrap";
import one from "../../../assets/images/pro3/1.jpg";
import user from "../../../assets/images/user.png";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import {getApiConfig} from "../../../helpers";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const Add_product = () => {
	const [loadedProduct, setLoadedProduct] = useState(null);
	// const [file, setFile] = useState();
	// const [dummyimgs, setDummyimgs] = useState([{ img: user },]);

	const navigate = useNavigate();

	//	image upload

	// const _handleImgChange = (e, i) => {
	// 	e.preventDefault();
	// 	let reader = new FileReader();
	// 	const image = e.target.files[0];
	// 	reader.onload = () => {
	// 		dummyimgs[i].img = reader.result;
	// 		setFile({ file: file });
	// 		setDummyimgs(dummyimgs);
	// 	};
	// 	reader.readAsDataURL(image);
	// };

	const handleValidSubmit = async (e) => {
		e.preventDefault();

		const response = await axios.put(`${getApiConfig().baseUrl}/articles/${loadedProduct?.id}`, loadedProduct, {headers: getApiConfig().headers});


		if (response.status === 201 || response.status === 200) {
			toast.success('Produsul a fost salvat cu succes!');
			setTimeout(() => {window.location.href = '/products/product-list'}, 2000);
		} else {
			toast.error('A aparut o eroare la salvarea promotiei!');
		}
	};

	const getProduct = async (id) => {
		const response = await axios.get(`${getApiConfig().baseUrl}/articles/${id}`, {headers: getApiConfig().headers});
		if (response?.data) {
			console.log(response.data);
			setLoadedProduct(response.data);
		}
	}

	const changeName = (value) => {
		setLoadedProduct({...loadedProduct, Nume: value});
	}
	const changeShortDescription = (value) => {
		setLoadedProduct({...loadedProduct, ScurtaDescriere: value});
	}

	const changeLongDescription = (value) => {
		setLoadedProduct({...loadedProduct, Descriere: value});
	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		if (id) {
			getProduct(id);
		} else {
			navigate('/products/list-products');
		}
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Editare produs" parent="Produse" />

			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Editare produs</h5>
							</CardHeader>
							<CardBody>
								<Row className="product-adding">
									<Col xl="5">
										<div className="add-product">
											<Row>
												<Col xl="9 xl-50" sm="6 col-9">
													<img
														src={loadedProduct?.Imagine}
														alt=""
														className="img-fluid image_zoom_1 blur-up lazyloaded"
													/>
												</Col>
												{/*<Col xl="3 xl-50" sm="6 col-3">*/}
												{/*	<ul className="file-upload-product">*/}
														{/*{dummyimgs.map((res, i) => {*/}
														{/*	return (*/}
														{/*		<li key={i}>*/}
														{/*			<div className="box-input-file">*/}
														{/*				<Input*/}
														{/*					className="upload"*/}
														{/*					type="file"*/}
														{/*					onChange={(e) => _handleImgChange(e, i)}*/}
														{/*				/>*/}
														{/*				<img*/}
														{/*					alt=""*/}
														{/*					src={res.img}*/}
														{/*					style={{ width: 50, height: 50 }}*/}
														{/*				/>*/}
														{/*			</div>*/}
														{/*		</li>*/}
														{/*	);*/}
														{/*})}*/}
													{/*</ul>*/}
												{/*</Col>*/}
											</Row>
										</div>
									</Col>
									<Col xl="7">
										<Form
											className="needs-validation add-product-form"
											onSubmit={handleValidSubmit}
										>
											<div className="form form-label-center">
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4 mb-0">
														Nume produs :
													</Label>
													<div className="col-xl-8 col-sm-7">
														<Input
															className="form-control"
															name="Nume"
															id="Nume"
															type="text"
															defaultValue={loadedProduct?.Nume}
															onChange={(e) => changeName(e.target.value)}
															required
														/>
													</div>
													<div className="valid-feedback">Ok!</div>
												</FormGroup>
											</div>
											<div className="form">
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4">
														Descriere scurta :
													</Label>
													<div className="col-xl-8 col-sm-7 description-sm">
														<MDEditor
														value={loadedProduct?.ScurtaDescriere}
														onChange={changeShortDescription}/>
													</div>
												</FormGroup>
												<FormGroup className="form-group mb-3 row">
													<Label className="col-xl-3 col-sm-4">
														Descriere lunga :
													</Label>
													<div className="col-xl-8 col-sm-7 description-sm">
														<MDEditor
														value={loadedProduct?.Descriere}
														onChange={changeLongDescription}/>
													</div>
												</FormGroup>
											</div>
											<div className="offset-xl-3 offset-sm-4">
												<Button type="submit" color="primary">
													Salveaza
												</Button>
											</div>
										</Form>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Add_product;
