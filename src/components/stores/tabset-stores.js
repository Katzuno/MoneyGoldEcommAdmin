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

			// Handle AdditionalImages - can be array of strings (legacy) or objects with url property
			let cleanedAdditionalImages = [];
			if (Array.isArray(storeData.AdditionalImages)) {
				cleanedAdditionalImages = storeData.AdditionalImages.filter(image => {
					if (typeof image === 'string') {
						// Legacy format: array of URLs
						return image.trim().length > 0 && !image.includes('[') && !image.includes(']');
					} else if (typeof image === 'object' && image.url) {
						// New format: array of objects with url property
						return typeof image.url === 'string' && image.url.trim().length > 0;
					}
					return false;
				});
			}

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
				AdditionalImages: cleanedAdditionalImages
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

	const removeAdditionalImage = (indexToRemove) => {
		setAdditionalImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
	};

	const uploadMainImage = async (storeId) => {
		if (!mainImageFile) return;

		const formData = new FormData();
		formData.append('file', mainImageFile);

		try {
			const response = await axios.post(`${getApiConfig().baseUrl}/store/${storeId}/upload-main-image`, formData, {
				headers: {
					...getApiConfig().headers,
					'Content-Type': 'multipart/form-data'
				}
			});

			// Update local state with the response data to show uploaded image immediately
			if (response.data && response.data.MainImage) {
				setStore(prev => ({
					...prev,
					MainImage: response.data.MainImage
				}));
			}
		} catch (error) {
			console.error('Error uploading main image:', error);
			toast.error('Eroare la încărcarea imaginii principale.');
		}
	};

	const uploadAdditionalImages = async (storeId) => {
		let lastResponse = null;

		for (const file of additionalImageFiles) {
			const formData = new FormData();
			formData.append('file', file);

			try {
				const response = await axios.post(`${getApiConfig().baseUrl}/store/${storeId}/upload-additional-image`, formData, {
					headers: {
						...getApiConfig().headers,
						'Content-Type': 'multipart/form-data'
					}
				});
				lastResponse = response; // Keep track of the last response
			} catch (error) {
				console.error('Error uploading additional image:', error);
				toast.error(`Eroare la încărcarea imaginii suplimentare: ${file.name}`);
			}
		}

		// Update local state with the latest response data to show all uploaded images immediately
		if (lastResponse && lastResponse.data && Array.isArray(lastResponse.data.AdditionalImages)) {
			// Handle AdditionalImages - can be array of strings or objects with url property
			const cleanedAdditionalImages = lastResponse.data.AdditionalImages.filter(image => {
				if (typeof image === 'string') {
					// Legacy format: array of URLs
					return image.trim().length > 0 && !image.includes('[') && !image.includes(']');
				} else if (typeof image === 'object' && image.url) {
					// New format: array of objects with url property
					return typeof image.url === 'string' && image.url.trim().length > 0;
				}
				return false;
			});

			setStore(prev => ({
				...prev,
				AdditionalImages: cleanedAdditionalImages
			}));

			// Clear the additional image files state since they have been uploaded
			setAdditionalImageFiles([]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			let response;
			// Send the core store data with empty arrays for images
			// Images are handled via separate upload endpoints, but we need to initialize empty arrays
			const storeData = {
				Name: store.Name?.trim(),
				Adresa: store.Adresa?.trim(),
				Schedule: store.Schedule?.trim(),
				Phone: store.Phone?.trim(),
				Latitude: store.Latitude?.trim(),
				Longitude: store.Longitude?.trim(),
				MapsURL: store.MapsURL?.trim(),
				AvailableServices: store.AvailableServices?.trim(),
				MainImage: null,
				AdditionalImages: []
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

			// Reset image file states after successful save
			setMainImageFile(null);
			setAdditionalImageFiles([]);

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
										<h6>Imagini suplimentare existente:</h6>
										<div className="d-flex flex-wrap gap-2">
											{store.AdditionalImages.map((image, index) => {
												// Handle both string URLs and object URLs
												const imageUrl = typeof image === 'string' ? image : image.url;
												const imageAlt = typeof image === 'object' && image.alt ? image.alt : `Imagine suplimentară ${index + 1}`;

												return (
													<div key={index} className="position-relative">
														<img
															src={imageUrl}
															alt={imageAlt}
															style={{
																width: '100px',
																height: '100px',
																objectFit: 'cover',
																borderRadius: '4px',
																border: '2px solid #dee2e6'
															}}
															onError={(e) => {
																console.error('Failed to load image:', imageUrl);
																e.target.style.display = 'none';
															}}
														/>
														<div className="mt-1">
															<small className="text-muted">Imagine {index + 1}</small>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}
								{additionalImageFiles.length > 0 && (
									<div className="mt-2">
										<h6>Imagini noi de încărcat:</h6>
										<div className="d-flex flex-wrap gap-2">
											{additionalImageFiles.map((file, index) => (
												<div key={index} className="text-center position-relative">
													<button
														type="button"
														className="btn btn-sm btn-danger position-absolute"
														style={{
															top: '-8px',
															right: '-8px',
															width: '20px',
															height: '20px',
															borderRadius: '50%',
															padding: '0',
															fontSize: '12px',
															lineHeight: '1'
														}}
														onClick={() => removeAdditionalImage(index)}
														title="Elimină imaginea"
													>
														×
													</button>
													<img
														src={URL.createObjectURL(file)}
														alt={`New ${index + 1}`}
														style={{
															width: '80px',
															height: '80px',
															objectFit: 'cover',
															borderRadius: '4px',
															border: '1px solid #dee2e6'
														}}
													/>
													<div className="mt-1">
														<small className="text-muted d-block" style={{fontSize: '10px', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
															{file.name}
														</small>
														<small className="text-muted" style={{fontSize: '9px'}}>
															{parseFloat(file.size / 1024).toFixed(1)} KB
														</small>
													</div>
												</div>
											))}
										</div>
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
