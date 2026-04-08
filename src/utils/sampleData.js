/**
 * Sample/demo data for development and testing.
 */

export const DEMO_CLIENT = {
    name: 'عميل تجريبي',
    phone: '01000000001',
    password: '123456',
}

export const DEMO_COURIER = {
    name: 'مندوب تجريبي',
    phone: '01000000002',
    password: '123456',
}

export const SAMPLE_ORDERS = [
    {
        order_number: 'ORD-ABC123',
        type: 'order_for_me',
        status: 'delivered',
        store_name: 'صيدلية الشفاء',
        items_description: 'مسكن ألم + فيتامين سي',
        pickup_address: 'شارع النيل، المعادي',
        delivery_address: 'شارع 9، المعادي',
        delivery_fee: 30,
        total_client_pays: 130,
        created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        order_number: 'ORD-DEF456',
        type: 'send_for_me',
        status: 'cancelled',
        package_description: 'مستندات مهمة',
        pickup_address: 'شارع التحرير، وسط البلد',
        delivery_address: 'مدينة نصر',
        delivery_fee: 35,
        total_client_pays: 35,
        created_at: new Date(Date.now() - 172800000).toISOString(),
    },
]