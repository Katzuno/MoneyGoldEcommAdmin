import React, {useEffect, useState} from 'react'
import Dropzone from 'react-dropzone-uploader'
import {getApiConfig} from "../../helpers";


const MyUploader = ({
                        extraGetUploadParams = () => {
                        },
                        extraHandleChangeStatus = () => {
                        },
                        extraHandleSubmit = () => {
                        },
                        mediaFile: mediaIdentifier,
                    }) => {

    const [display, setDisplay] = useState(false);

  useEffect(() => {

    console.log('MEDIA FILE: ', mediaIdentifier)
  }, [mediaIdentifier]);

    useEffect(() => {
    }, [display])

    // specify upload params and url for your files
    const getUploadParams = () => {
        setDisplay(!display)
       if (mediaIdentifier) {
            return {
                url: `${getApiConfig().baseUrl}/media/${mediaIdentifier}/upload`,
                headers: {Authorization: getApiConfig().headers.Authorization},
            };
       } else {
         return {url: `https://httpbin.org/post`};
       }
    };

    // called every time a file's `status` changes
    const handleChangeStatus = ({meta}, status) => {
        setDisplay(!display)
        console.log("handleChangeStatus", status, meta);
    };

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {
        console.log("HandleSubmit", files.map(f => f.meta));
        allFiles.forEach(f => f.remove());


    };


    return (
        <div className="dropzone">
            <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                onSubmit={handleSubmit}
                styles={{dropzone: {minHeight: 300, maxHeight: 300}}}
            />
        </div>

    )
}

export default MyUploader
