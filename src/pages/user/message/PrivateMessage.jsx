import React, { useState, useEffect } from "react";
import { Input, Button, List, Typography } from "antd";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faFileImage, faMinus, faPhone, faSquarePlus, faThumbsUp, faVideo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AntDesignOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import { faSquareReddit, faVimeo } from "@fortawesome/free-brands-svg-icons";

const { TextArea } = Input;
const { Text } = Typography;

const PrivateMessage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Danh sách người dùng trong nhóm
    const usersInGroup = [
        { id: 101, name: "Nguyễn Thế Quốc" },
        { id: 102, name: "Lê Minh Tâm" },
        { id: 103, name: "Trần Thanh Hòa" },
    ];

    useEffect(() => {
        const mockMessages = [
            {
                id: 1,
                roomId: 1,
                senderId: 101,
                content: "Thế sao theo đc",
                sentAt: "2024-11-18T13:40:00Z",
                isRead: true,
                isDeleted: false,
            },
            {
                id: 2,
                roomId: 1,
                senderId: 102,
                content: "Vẫn đc ạ. Thầy cô hỗ trợ nên học 5 năm",
                sentAt: "2024-11-18T13:41:00Z",
                isRead: true,
                isDeleted: false,
            },
            {
                id: 3,
                roomId: 1,
                senderId: 103,
                content: "oke",
                sentAt: "2024-11-18T13:41:00Z",
                isRead: true,
                isDeleted: false,
            },
            {
                id: 4,
                roomId: 1,
                senderId: 101,
                content: "kệ m",
                sentAt: "2024-11-18T13:41:00Z",
                isRead: true,
                isDeleted: false,
            },
        ];
        setMessages(mockMessages);
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                roomId: 1,
                senderId: 101,
                content: newMessage,
                sentAt: new Date().toISOString(),
                isRead: false,
                isDeleted: false,
            };
            setMessages([...messages, newMsg]);
            setNewMessage("");
        }
    };

    return (
        <div style={{
            background: '#fff',

            padding: '10px', width: '360px',
            height: '455px', marginLeft: '50px',
            marginTop: '40px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #EEEEEE', borderRadius: 8,
            top: '20px',
            right: '55px',

        }}>
            <div style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #EEEEEE', marginTop: '-10px', marginLeft: '-10px',
                width: '360px', borderRadius: 8, borderBottom: 0,
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    display: 'flex',
                    backgroundColor: 'transparent',
                    alignItems: 'center', // Đảm bảo các phần tử căn giữa theo chiều dọc
                    flex: 1 // Đảm bảo các phần tử chiếm đủ không gian
                }}>
                    <div style={{ marginRight: '10px' }}>
                        <Avatar.Group style={{ maxWidth: '80px',marginTop:'3px' }}
                            max={{
                                count: 2,
                                style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                            }}
                        >
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
                            <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                            <Tooltip title="Ant User" placement="top">
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            </Tooltip>
                            <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
                        </Avatar.Group>
                    </div>
                    {/* Hiển thị tên người dùng trong nhóm chat */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                        <Text style={{ marginRight: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px', }}>
                            {usersInGroup.map((user, index) => {
                                // Lấy tên người dùng
                                const userName = user.name;

                                // Kiểm tra nếu không phải là người cuối cùng thì thêm dấu "và"
                                if (index < usersInGroup.length - 1) {
                                    return `${userName} và `;
                                } else {
                                    return userName;
                                }
                            })}
                        </Text>
                    </div>


                </div>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginTop: '-5px'
                }}>
                    <FontAwesomeIcon icon={faPhone} />
                    <FontAwesomeIcon icon={faVideo} />
                    <FontAwesomeIcon icon={faMinus} />
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>

            <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 0 }}>
                <List
                    dataSource={messages}
                    renderItem={(msg) => (
                        <List.Item
                            key={msg.id}
                            style={{ padding: "8px 0", display: "flex", border: "none" }} 
                        >
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                style={{ marginRight: 8,marginTop: 22 }}
                            />
                            <div style={{ flex: 1 }}>
                                <Text strong>
                                    {usersInGroup.find((user) => user.id === msg.senderId)?.name}
                                </Text>
                                <br />
                                <div style={{
                                    height: '34px',
                                    borderRadius: 40,
                                    background: '#EEEEEE',
                                    padding: '8px',
                                    display: 'inline-block',
                                    maxWidth: '100%'
                                }}>
                                    <Text>{msg.content}</Text>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' ,
                backgroundColor: 'transparent',
                flex: 1,

                marginTop: 60
            }}>
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginTop: '5px'}}>
                    <FontAwesomeIcon icon={faSquarePlus} style={{ color: "#74C0FC", }} />
                    <FontAwesomeIcon icon={faFileImage} style={{ color: "#74C0FC", }} />
                    <FontAwesomeIcon icon={faSquareReddit} style={{ color: "#74C0FC", }} />
                    <FontAwesomeIcon icon={faVimeo} style={{color: "#74C0FC",}} />
                </div>
                <div style={{
                display: 'flex',alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
                <div className="relative">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={1}
                        placeholder="   Aa"
                        style={{ flex: 1, borderRadius: 50, background: '#EEEEEE', height: '40px', }}
                    />
                    <FontAwesomeIcon className="absolute bottom-1/2 translate-y-1/2 right-[10px] z-10 hover:cursor-pointer" icon={faFaceSmile} style={{ color: "#74C0FC",  fontSize: '20px'}} />
                </div >
                <FontAwesomeIcon icon={faThumbsUp} className=" hover:cursor-pointer" style={{ color: "#74C0FC",  fontSize: '20px', }} />
                </div>
            </div>
        </div>
    );
};

export default PrivateMessage;
