import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { Button, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getApiConfig } from "../../helpers";

const TabsetStore = ({ storeId, onSave }) => {
	const [store, setStore] = useState({
		Name: '',
		Adresa: '',
		Schedule: '',
		Phone: '',
		Latitude: '',
		Longitude: '',
		MapsURL: '',
		AvailableServices: '',
		MainImage: null,
		AdditionalImages: []
	});

	const [loading, setLoading] = useState(false);
	const [mainImageFile, setMainImageFile] = useState(null);
	const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

	const fetchStore = useCallback(async () => {
		try {
			const response = await axios.get(`${getApiConfig().baseUrl}/store/${storeId}`, {
				headers: getApiConfig().headers
			});
			const storeData = response.data;
			setStore({
				Name: storeData.Name || '',
				Adresa: storeData.Adresa || '',
				Schedule: storeData.Schedule || '',
				Phone: storeData.Phone || '',
				Latitude: storeData.Latitude || '',
				Longitude: storeData.Longitude || '',
				MapsURL: storeData.MapsURL || '',
				AvailableServices: storeData.AvailableServices || '',
				MainImage: storeData.MainImage || null,
				AdditionalImages: Array.isArray(storeData.AdditionalImages) ? storeData.AdditionalImages : []
			});
		} catch (error) {
			console.error('Error fetching store:', error);
		}
	}, [storeId]);

	useEffect(() => {
		if (storeId) {
			fetchStore();
		} else {
			// Reset form for new store creation
			setStore({
				Name: '',
				Adresa: '',
				Schedule: '',
				Phone: '',
				Latitude: '',
				Longitude: '',
				MapsURL: '',
				AvailableServices: '',
				MainImage: null,
				AdditionalImages: []
			});
		}
	}, [storeId, fetchStore]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setStore(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleMainImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setMainImageFile(file);
		}
	};

	const handleAdditionalImagesChange = (e) => {
		const files = Array.from(e.target.files);
		setAdditionalImageFiles(prev => [...prev, ...files]);
	};

	const uploadMainImage = async (storeId) => {
		if (!mainImageFile) return;

		const formData = new FormData();
		formData.append('file', mainImageFile);

		try {
			await axios.post(`${getApiConfig().baseUrl}/store/${storeId}/upload-main-image`, formData, {
				headers: {
					...getApiConfig().headers,
					'Content-Type': 'multipart/form-data'
				}
			});
		} catch (error) {
			console.error('Error uploading main image:', error);
			toast.error('Eroare la încărcarea imaginii principale.');
		}
	};

	const uploadAdditionalImages = async (storeId) => {
		for (const file of additionalImageFiles) {
			const formData = new FormData();
			formData.append('file', file);

			try {
				await axios.post(`${getApiConfig().baseUrl}/store/${storeId}/upload-additional-image`, formData, {
					headers: {
						...getApiConfig().headers,
						'Content-Type': 'multipart/form-data'
					}
				});
			} catch (error) {
				console.error('Error uploading additional image:', error);
				toast.error(`Eroare la încărcarea imaginii suplimentare: ${file.name}`);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			let response;
			const storeData = {
				Name: store.Name,
				Adresa: store.Adresa,
				Schedule: store.Schedule,
				Phone: store.Phone,
				Latitude: store.Latitude,
				Longitude: store.Longitude,
				MapsURL: store.MapsURL,
				AvailableServices: store.AvailableServices
			};

			if (storeId) {
				response = await axios.put(`${getApiConfig().baseUrl}/store/${storeId}`, storeData, {
					headers: getApiConfig().headers
				});
			} else {
				response = await axios.post(`${getApiConfig().baseUrl}/store`, storeData, {
					headers: getApiConfig().headers
				});
			}

			const savedStoreId = response.data.id || storeId;

			// Upload images after store is created/updated
			if (mainImageFile) {
				await uploadMainImage(savedStoreId);
			}
			if (additionalImageFiles.length > 0) {
				await uploadAdditionalImages(savedStoreId);
			}

			// Show success toast
			toast.success(storeId ? 'Magazin actualizat cu succes!' : 'Magazin creat cu succes!');

			if (onSave) {
				onSave(response.data);
			}
		} catch (error) {
			console.error('Error saving store:', error);
			// Show error toast
			toast.error('Eroare la salvarea magazinului. Vă rugăm să încercați din nou.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Fragment>
			<Form onSubmit={handleSubmit}>
				<Tabs>
					<TabList className="nav nav-tabs tab-coupon">
						<Tab className="nav-link">Informații generale</Tab>
						<Tab className="nav-link">Locație și contact</Tab>
						<Tab className="nav-link">Imagini</Tab>
					</TabList>

					<TabPanel>
						<h4>Informații generale</h4>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								<span>*</span> Nume magazin
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									name="Name"
									type="text"
									required
									value={store.Name}
									onChange={handleInputChange}
								/>
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								<span>*</span> Program
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									name="Schedule"
									type="text"
									required
									placeholder="Ex: L-V: 9:00-18:00, S: 9:00-14:00"
									value={store.Schedule}
									onChange={handleInputChange}
								/>
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								<span>*</span> Servicii disponibile
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									name="AvailableServices"
									type="textarea"
									rows="3"
									required
									placeholder="Ex: Cumpărare aur, Reparații bijuterii, Servicii ceasuri, Servicii amanet"
									value={store.AvailableServices}
									onChange={handleInputChange}
								/>
							</div>
						</FormGroup>
					</TabPanel>

					<TabPanel>
						<h4>Locație și contact</h4>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								<span>*</span> Adresă
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									name="Adresa"
									type="text"
									required
									placeholder="Ex: Strada Victoriei 123, București"
									value={store.Adresa}
									onChange={handleInputChange}
								/>
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								<span>*</span> Telefon
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									name="Phone"
									type="tel"
									required
									placeholder="Ex: +40 21 123 4567"
									value={store.Phone}
									onChange={handleInputChange}
								/>
							</div>
						</FormGroup>
						<Row>
							<Col md="6">
								<FormGroup className="row">
									<Label className="col-xl-6 col-md-6">
										<span>*</span> Latitudine
									</Label>
									<div className="col-xl-6 col-md-6">
										<Input
											className="form-control"
											name="Latitude"
											type="text"
											required
											placeholder="Ex: 44.4268"
											value={store.Latitude}
											onChange={handleInputChange}
										/>
									</div>
								</FormGroup>
							</Col>
							<Col md="6">
								<FormGroup className="row">
									<Label className="col-xl-6 col-md-6">
										<span>*</span> Longitudine
									</Label>
									<div className="col-xl-6 col-md-6">
										<Input
											className="form-control"
											name="Longitude"
											type="text"
											required
											placeholder="Ex: 26.1025"
											value={store.Longitude}
											onChange={handleInputChange}
										/>
									</div>
								</FormGroup>
							</Col>
						</Row>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								<span>*</span> URL Google Maps
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									name="MapsURL"
									type="url"
									required
									placeholder="Ex: https://maps.google.com/?q=44.4268,26.1025"
									value={store.MapsURL}
									onChange={handleInputChange}
								/>
							</div>
						</FormGroup>
					</TabPanel>

					<TabPanel>
						<h4>Imagini magazin</h4>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								Imagine principală
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									type="file"
									accept="image/*"
									onChange={handleMainImageChange}
								/>
								{store.MainImage && (
									<div className="mt-2">
										<img
											src={store.MainImage}
											alt="Main store"
											style={{ maxWidth: '200px', maxHeight: '200px' }}
										/>
									</div>
								)}
								{mainImageFile && (
									<div className="mt-2">
										<small className="text-info">Imagine nouă selectată: {mainImageFile.name}</small>
									</div>
								)}
							</div>
						</FormGroup>
						<FormGroup className="row">
							<Label className="col-xl-3 col-md-4">
								Imagini suplimentare
							</Label>
							<div className="col-xl-8 col-md-7">
								<Input
									className="form-control"
									type="file"
									accept="image/*"
									multiple
									onChange={handleAdditionalImagesChange}
								/>
								{Array.isArray(store.AdditionalImages) && store.AdditionalImages.length > 0 && (
									<div className="mt-2">
										<h6>Imagini existente:</h6>
										<div className="d-flex flex-wrap gap-2">
											{store.AdditionalImages.map((image, index) => (
												<img
													key={index}
													src={image}
													alt={`Additional ${index + 1}`}
													style={{ width: '80px', height: '80px', objectFit: 'cover' }}
												/>
											))}
										</div>
									</div>
								)}
								{additionalImageFiles.length > 0 && (
									<div className="mt-2">
										<h6>Imagini noi de încărcat:</h6>
										<ul>
											{additionalImageFiles.map((file, index) => (
												<li key={index} style={{display: 'block'}}>
													<small>{file.name} &nbsp; {parseFloat(file.size / 1024).toFixed(2)} KB </small>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</FormGroup>
					</TabPanel>
				</Tabs>
				<div className="pull-right">
					<Button type="submit" color="primary" disabled={loading}>
						{loading ? 'Se salvează...' : (storeId ? 'Actualizează' : 'Salvează')}
					</Button>
				</div>
			</Form>
		</Fragment>
	);
};

export default TabsetStore;
