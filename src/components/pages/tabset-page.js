import React, {Fragment, useEffect, useState} from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { Button, Form, Input, Label } from "reactstrap";
import MDEditor from "@uiw/react-md-editor";
import {getApiConfig} from "../../helpers";
import axios from "axios";
import {toast} from "react-toastify";

const TabsetPage = (objectInfo = null) => {
	const [text, setText] = useState('');

	const onChange = (e) =>{
		setText(e)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await axios.patch(`${getApiConfig().baseUrl}/translations/${objectInfo.objectInfo?.id}`, {text: text}, {headers: getApiConfig().headers});

		if (response.status === 201 || response.status === 200) {
			toast.success('Textul a fost salvat cu succes!');
			setTimeout(() => {window.location.href = '/pages/list-pages'}, 2000);
		} else {
			toast.error('A aparut o eroare la salvarea textului!');
		}
	}

	useEffect(() => {
		setText(objectInfo.objectInfo?.text);
	}, [objectInfo]);

	return (
		<Fragment>
			<div>
				<Tabs>
					<TabList className="nav nav-tabs tab-coupon">
						<Tab className="nav-link">General</Tab>
					</TabList>

					<TabPanel>
						<Form className="needs-validation" onSubmit={handleSubmit}>
							<h4>General</h4>
							<div className="form-group row">
								<Label className="col-xl-3 col-md-4">
									Identificator
								</Label>
								<div className="col-xl-8 col-md-7 p-0">
									<Input
										className="form-control"
										id="validationCustom0"
										type="text"
										defaultValue={objectInfo.objectInfo?.stringIdentifier}
										readOnly={true}
										disabled={true}
									/>
								</div>
							</div>
							<div className="form-group row">
								<Label className="col-xl-3 col-md-4">
									Pozitionare
								</Label>
								<div className="col-xl-8 col-md-7 p-0">
									<Input
										className="form-control"
										id="validationCustom0"
										type="text"
										defaultValue={objectInfo.objectInfo?.page}
										readOnly={true}
										disabled={true}
									/>
								</div>
							</div>
							<div className="form-group row editor-label">
								<Label className="col-xl-3 col-md-4">
									<span>*</span> Text
								</Label>
								<div className="col-xl-8 col-md-7 editor-space p-0">
								<MDEditor
									value={text}
									onChange={onChange}
								/>
								</div>
							</div>
							<div className="pull-right">
								<Button type="submit" color="primary">
									Save
								</Button>
							</div>
						</Form>
					</TabPanel>
				</Tabs>
			</div>
		</Fragment>
	);
};

export default TabsetPage;
