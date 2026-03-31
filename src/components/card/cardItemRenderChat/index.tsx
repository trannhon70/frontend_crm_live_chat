import { Fragment } from "react/jsx-runtime";
import { CHECK_FILE, SENDER_TYPE } from "../../../utils";
import moment from "moment";
import { FaRegUserCircle } from "react-icons/fa";

export const renderStaff = (item: any) => {
    return (
        <Fragment key={item.id} >
            {
                item.content && <div className="mt-2" >
                    <span className="text-xs text-orange-600 flex items-center gap-1 " ><FaRegUserCircle /> khách hàng :</span>
                    <div className="flex w-full " >
                        <span
                            className="bg-white p-2 rounded min-w-[1%] max-w-[70%]"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </div>
                </div>
            }
            {
                item.file && renderFileStaff(item.file)

            }
            <span className="text-xs text-gray-500 " >{moment(item.created_at * 1000).format("DD-MM-YYYY HH:mm:ss")}</span>
        </Fragment>
    )
};

export const renderFileStaff = (file: string) => {
    const extension = file.split('.').pop();
    switch (extension) {
        case CHECK_FILE.MP4:
            return <div className="mt-2">
                <span className="text-xs text-orange-600 flex items-center gap-1 " ><FaRegUserCircle /> khách hàng :</span>
                <div className="flex w-full " >
                    <div
                        className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                    >
                        <video
                            src={file}
                            controls >
                        </video>
                    </div>
                </div>
            </div>

        case CHECK_FILE.MP3:
        case CHECK_FILE.M4A:
            return (
                <div className="mt-2">
                    <span className="text-xs text-orange-600 flex items-center gap-1 " ><FaRegUserCircle /> khách hàng :</span>
                    <div className="flex w-full " >
                        <div
                            className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                        >
                            <audio style={{ width: '300px', height: '40px' }} controls>
                                <source src="horse.ogg" type="audio/ogg" />
                                <source src={file} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="mt-2">
                <span className="text-xs text-orange-600 flex items-center gap-1 " ><FaRegUserCircle /> khách hàng :</span>
                <div className="flex w-full " >
                    <div
                        className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                    >
                        <img className="w-[100%] h-[100%]" src={file} alt="..." />
                    </div>
                </div>
            </div>
    }
}


export const renderCustomer = (item: any) => {
    const renderFullName = () => {
        if (item.senderType === SENDER_TYPE.AUTO) {
            return 'Chat tự động'
        }
        if (item.senderType === SENDER_TYPE.AI) {
            return 'AI chat'
        }
    }

    return (
        <Fragment key={item.id} >
            {
                item.content &&
                <div className="mt-2">
                    <span className="text-xs text-orange-600 flex items-center justify-end gap-1 " >{item.userId ? item?.user?.fullName : renderFullName()} <FaRegUserCircle /></span>
                    <div className="flex items-end justify-end w-full " >
                        <div
                            className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </div>
                </div>
            }
            {
                item.file && renderFileCustomer(item)

            }
            <span className="text-xs text-gray-500 flex items-end justify-end w-full" >{moment(item.created_at * 1000).format("DD-MM-YYYY HH:mm:ss")}</span>
        </Fragment>
    );
}

export const renderFileCustomer = (item: any) => {
    const extension = item.file.split('.').pop();
    switch (extension) {
        case CHECK_FILE.MP4:
            return <div className="mt-2">
                <span className="text-xs text-orange-600 flex items-center justify-end gap-1 " >{item?.user?.fullName} <FaRegUserCircle /></span>
                <div className="flex items-end justify-end w-full " >
                    <div
                        className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                    >
                        <video
                            src={item.file}
                            controls >
                        </video>
                    </div>
                </div>
            </div>

        case CHECK_FILE.MP3:
        case CHECK_FILE.M4A:
            return (
                <div className="mt-2">
                    <span className="text-xs text-orange-600 flex items-center justify-end gap-1 " >{item?.user?.fullName} <FaRegUserCircle /></span>
                    <div className="flex items-end justify-end w-full " >
                        <div
                            className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                        >
                            <audio style={{ width: '240px', height: '40px' }} controls>
                                <source src="horse.ogg" type="audio/ogg" />
                                <source src={item.file} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>

            );
        default:
            return <div className="mt-2">
                <span className="text-xs text-orange-600 flex items-center justify-end gap-1 " >{item?.user?.fullName} <FaRegUserCircle /></span>
                <div className="flex items-end justify-end w-full " >
                    <div
                        className="bg-white p-2 rounded min-w-[10%] max-w-[70%] "
                    >
                        <img className="w-[100%] h-[100%]" src={item.file} alt="..." />
                    </div>
                </div>
            </div>
    }
}