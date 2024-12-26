import React, { useState } from 'react';
import { List, Avatar, Input, Typography, Divider, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, Route, Router, Routes } from 'react-router-dom';
import PrivateMessage from './PrivateMessage';

const { Text } = Typography;

const Massege = () => {
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'

    const data = [
        {
            roomId: 1,
            title: 'Midu Mohon',
            description: 'Bạn: Mế xin méo biết là luôn xon...',
            time: '1 giờ',
            avatar: 'https://random.imagecdn.app/200/140',
            isRead: true,
            isGroup: false,
        },
        {
            roomId: 2,
            title: 'Trùm phòng trọ Hà Nội',
            description: 'Phương Hoa đã gửi 1 ảnh...',
            time: '2 giờ',
            avatar: 'https://random.imagecdn.app/200/230',
            isRead: false,
            isGroup: true,
        },
        {
            roomId: 3,
            title: 'Duy Hiệp',
            description: 'Ok a - 12 giờ',
            time: '12 giờ',
            avatar: 'https://random.imagecdn.app/200/180',
            isRead: true,
            isGroup: false,
        },
        {
            roomId: 4,
            title: 'Bảng Vàng - Tam Phát Land',
            description: 'Duc: Sale: Thịnh cute KD1 C...',
            time: '13 giờ',
            avatar: 'https://random.imagecdn.app/200/156',
            isRead: true,
            isGroup: false,
        },
        {
            roomId: 5,
            title: 'HERO BOOK GAME NFT S5',
            description: 'Nguyễn Thế Nam đã rời khỏi...',
            time: '2 ngày',
            avatar: 'https://random.imagecdn.app/200/204',
            isRead: false,
            isGroup: true,
        },
        // Thêm các mục khác tương tự

    ];

    //  const filteredData = filter === 'all' ? data : data.filter(item => !item.isRead);

    const filteredData = filter === 'all'
        ? data
        : filter === 'unread'
            ? data.filter(item => !item.isRead)
            : data.filter(item => item.isGroup);

    return (
        <div style={{
            background: '#fff',
            overflow: 'auto',
            padding: '10px', width: '360px',
            height: '550px', marginLeft: '30px',
            marginTop: '40px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #EEEEEE', borderRadius: 8,
            position: 'absolute',
            top: '20px',
            right: '55px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
                <h1 style={{ marginBottom: 12, fontSize: '20px', fontWeight: 'bold' }}>Đoạn chat</h1>
                <div style={{
                    display: 'flex', gap: '20px', backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginTop: '-18px'
                }}>
                    <button>
                        ...
                    </button>

                    <FontAwesomeIcon
                        icon={faMaximize}
                        style={{ marginTop: '8px' }}
                    />
                    <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ marginTop: '7px' }}
                    />
                </div>
            </div>
            {/* Thanh tìm kiếm */}
            <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm trên Messenger"
                style={{ marginBottom: 12 }}
            />


            {/* Tab Hộp thư và Cộng đồng */}

            <Space style={{ marginBottom: '15px' }}>
                <Button
                    onClick={() => setFilter('all')}
                    style={{
                        color: filter === 'all' ? 'blue' : 'black',
                        borderRadius: '25px',
                        backgroundColor: filter === 'all' ? '#e6f7ff' : 'white',
                        borderColor: filter === 'all' ? '#91d5ff' : '#d9d9d9',
                        border: 'none', boxShadow: 'none',
                    }}
                >
                    Hộp thư
                </Button>
                <Button
                    onClick={() => setFilter('unread')}
                    style={{
                        color: filter === 'unread' ? 'blue' : 'black',
                        borderRadius: '25px',
                        backgroundColor: filter === 'unread' ? '#e6f7ff' : 'white',
                        borderColor: filter === 'unread' ? '#91d5ff' : '#d9d9d9',
                        border: 'none', boxShadow: 'none',
                    }}
                >
                    Cộng đồng
                </Button>
            </Space>



            {/* Danh sách tin nhắn */}
            <div style={{ overflowY: 'scroll', height: 'calc(100% - 150px)' }}>
                <List style={{
                    width: '318px',
                    height: '550px',
                }}
                    itemLayout="horizontal"
                    dataSource={filteredData}
                    renderItem={(item) => (
                        <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<Text strong>{item.title}</Text>}
                                    description={
                                        <div>
                                            <Text>{item.description}</Text>
                                            <div style={{ fontSize: 12, color: 'gray' }}>{item.time}</div>
                                        </div>
                                    }
                                />


                                <div style={{
                                    width: '3%',
                                    textAlign: 'right',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    height: '100%',
                                    top: '55%',
                                }}>
                                    <span
                                        style={{
                                            padding: '5px 5px',
                                            backgroundColor: item.isRead ? 'transparent' : '#52c41a',
                                            color: item.isRead ? '#999' : '#fff',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {item.isRead ? '' : ''}
                                    </span>
                                </div>
                           
                        </List.Item>
                    )}
                />
                
            </div>
        </div>
    );
};

export default Massege;
