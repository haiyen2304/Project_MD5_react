import React, { useState } from 'react';
import { List, Avatar, Button, Typography, Space, Flex } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Notification = () => {
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'

    const data = [
        {
            id: 1,
            title: 'Bạn có một lượt thích mới trên Trang của mình.',
            time: '2 giờ',
            userName: 'Chiko Hoà Mạc - Trà Sữa Nhật',
            icon: <BellOutlined />,
            isRead: false,
        },
        {
            id: 2,
            title: 'Có tin mới từ Midu Mohon: "Cảm ơn".',
            time: '6 giờ',
            userName: 'Midu Mohon',
            icon: <BellOutlined />,
            isRead: true,
        },
        {
            id: 3,
            title: 'Bạn đã được khôi phục quyền truy cập vào Marketplace.',
            time: '6 ngày',
            userName: 'Facebook',
            icon: <BellOutlined />,
            isRead: false,
        },
        {
            id: 4,
            title: 'Nguyễn Tuấn đã thêm 13 ảnh mới.',
            time: '1 tuần',
            userName: 'Nguyễn Tuấn',
            icon: <BellOutlined />,
            isRead: true,
        },
        {
            id: 5,
            title: 'Bạn có thể chơi Tiến lên miền Nam AG TLMM cùng Midu Mohon.',
            time: '2 ngày',
            userName: 'Midu Mohon',
            icon: <BellOutlined />,
            isRead: false,
        },
        {
            id: 6,
            title: 'Từ Quân đã thêm một bài niệm yết trong Thuê Phòng Trọ.',
            time: '3 ngày',
            userName: 'Từ Quân',
            icon: <BellOutlined />,
            isRead: true,
        },
    ];

    const filteredData = filter === 'all' ? data : data.filter(item => !item.isRead);

    return (
        <div style={{
            background: '#fff',
            width: '360px',
            height: '550px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'auto',
            marginLeft: '30px',
            marginTop: '40px',
            position: 'absolute',
            top: '20px',
            right: '55px'
        }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
                    <h1 style={{ marginBottom: '8px', marginTop: '6px', fontSize: '20px', fontWeight: 'bold' }}>Thông báo</h1>
                    <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '0px' }}>
                        ...
                    </button>
                </div>
                <Space style={{ marginBottom: '15px', }}>
                    <Button
                        onClick={() => setFilter('all')}
                        style={{
                            color: filter === 'all' ? 'blue' : 'black', borderRadius: '25px',
                            backgroundColor: filter === 'all' ? '#e6f7ff' : 'white',
                            borderColor: filter === 'all' ? '#91d5ff' : '#d9d9d9', border: 'none', boxShadow: 'none',
                        }}
                    >
                        Tất cả
                    </Button>
                    <Button
                        onClick={() => setFilter('unread')}
                        style={{
                            color: filter === 'unread' ? 'blue' : 'black', borderRadius: '25px',
                            backgroundColor: filter === 'unread' ? '#e6f7ff' : 'white',
                            borderColor: filter === 'unread' ? '#91d5ff' : '#d9d9d9', border: 'none', boxShadow: 'none',
                        }}
                    >
                        Chưa đọc
                    </Button>
                </Space>
                <List style={{
                    width: '340px',
                    height: '550px',
                    overflow: 'auto', // Đảm bảo nội dung cuộn nếu quá dài
                }}
                    itemLayout="horizontal"
                    dataSource={filteredData}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                backgroundColor: item.isRead ? '#f0f0f0' : '#e6f7ff',
                                marginBottom: 2,
                                width: '100%',
                                height: '74px',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: '8px',
                            }}
                        >
                           
                            <div style={{
                                width: '20%',  
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%', 
                            }}>
                                <Avatar src={`https://i.pravatar.cc/150?img=${item.id}`} size={50} />
                            </div>

                            
                            <div style={{
                                width: '50%',  
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                paddingLeft: '10px',
                                height: '100%',
                                overflow: 'hidden',
                            }}>
                                <Text strong>{item.userName}</Text>
                                <div style={{
                                    whiteSpace: 'nowrap',  
                                    overflow: 'hidden',    
                                    textOverflow: 'ellipsis', 
                                    marginBottom: '5px',  
                                }}>
                                    {item.title}
                                </div>

                               
                                <Text type={item.isRead ? 'secondary' : 'primary'} style={{ marginTop: '5px' }}>
                                    {item.time}
                                </Text>
                            </div>

                          
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

export default Notification;
