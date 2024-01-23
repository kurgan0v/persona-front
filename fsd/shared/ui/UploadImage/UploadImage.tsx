"use client";
import {App, Button, Modal, Upload, UploadProps} from "antd";
import {QuestionCircleOutlined, UploadOutlined} from "@ant-design/icons";
import React from "react";
import {UploadFile} from "antd/es/upload/interface";
import {useMutation} from "react-query";
import {DeleteFileFetcher, UploadFileFetcher} from "@/fsd/shared/api/file";
interface Props{
    list: UploadFile[]
    changeImage: (fileName: string, fileList: UploadFile[]) => void
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
    maxLength?: number
}
const UploadImage = ({list, changeImage, setFileList, maxLength}: Props) => {
    const { modal } = App.useApp();
    const {mutateAsync: uploadFile} = useMutation(UploadFileFetcher);
    const {mutateAsync: deleteFile} = useMutation(DeleteFileFetcher);
    const props: UploadProps = {
        fileList: list,
        listType: "picture-card",
       customRequest: ({onSuccess, onError, file, onProgress}) => {
            const formData = new FormData();
            formData.append("file", file);
            uploadFile(formData).then(res => {
                if(onSuccess){
                    onSuccess(res.id)
                }
            }).catch(err => {
                if(onError){
                    onError(err);
                }
            })
        },
        onChange: ({ file, fileList, event }) => {
            setFileList(fileList)
            if(file.status === 'done'){
                changeImage(file.response, fileList);
            }
            if(file.status === 'removed'){
                changeImage('', fileList);
            }
        },
        onRemove: async (file) => {
            return new Promise((resolve, reject) => {
                modal.confirm({
                    title: 'Вы уверены, что хотите удалить изображение?',
                    okText: "Да",
                    cancelText: "Отмена",
                    icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
                    onOk: () => {
                        resolve(true)
                        deleteFile(file.response).then(res => {
                        })
                    },
                    onCancel: () =>{
                        reject(true)
                    }
                })
            })
        }

    };
    return (
        <Upload {...props}>
            {list.length >= (maxLength ?? 1) ? null : <Button icon={<UploadOutlined/>}></Button>}
        </Upload>
    );
};

export default UploadImage;
