import { Phone, Calendar, MapPin } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';

export default function CustomerOrderCard({data}:any) {
  return (
    <div className=" w-full mx-auto bg-white rounded-xl shadow-md p-6 font-sans space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="profile"
          className="w-12 h-12 rounded-2xl object-cover"
        />
        <div>
          <h2 className="text-base font-semibold text-gray-900">{data?.customer?.firstName} {data?.customer?.lastName || ''}</h2>
          <p className="text-xs text-red-600">Customer ID : {data?.customer?._id?.substr(data?.customer?._id?.length - 4)}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-yellow-400 p-2 rounded-full">
            <Phone size={16} className="text-black" />
          </div>
          <span className="font-medium text-gray-900">{data?.customer?.phoneNumber || '-'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-yellow-400 p-2 rounded-full">
            <MapPin size={16} className="text-black" />
          </div>
          <span className="font-medium text-gray-900">
            {data?.fullAddress?.name || '-'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-yellow-400 p-2 rounded-full">
            <Calendar size={16} className="text-black" />
          </div>
          <span className="font-medium text-gray-900">{moment(data?.updatedAt).format('DD MMM YYYY')}</span>
        </div>
      </div>

      {/* Time Row */}
      <div className="flex justify-between text-sm font-medium pt-2">
        <span className="text-gray-500">Time</span>
        <span className="text-gray-900">{data?.time}</span>
      </div>

      {/* Order List */}
      <div className="space-y-3 text-sm text-gray-900">
        {/* <div className="flex justify-between items-center border-t gap-2 border-gray-100 pt-2">
          <div>
            <span className="font-bold">1x</span> Bacon Cheese Burger
          </div>
          <div className="text-xs">
            <div className="text-xs line-through text-gray-400">Rs. 1200</div>
            <p>Rs. 1000</p>
        </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">2x</span> French Fries
          </div>
          <div className="font-semibold text-xs">Rs. 500</div>
        </div> */}
        {data?.menuItems?.length > 0 && data?.menuItems?.map((item:any,index:number) => item?.menuItemId ? (
            <div key={index} className="flex justify-between items-center gap-2 text-gray-400">
              <div className="flex items-center gap-2">
                <span >{item?.quantity}x {item?.menuItemId?.title}</span>
              </div>
              {/* <div className="text-[10px] text-center font-semibold px-2 py-0.5 bg-gray-300 rounded-full">SOLD OUT</div> */}
              <div className=" text-xs">Rs. {item?.menuItemId?.price}</div>
            </div>

        ):null)}
      </div>

      {/* Subtotal & Delivery */}
      <div className="text-sm space-y-1 border-t border-gray-200 pt-2">
        <div className="flex justify-between">
          <span className="font-semibold">Subtotal</span>
            <span className="text-gray-900 font-semibold">
              Rs. {data?.menuItems?.reduce((acc: number, item: any) => acc + (item?.menuItemId?.price || 0), 0)}
            </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Delivery Fee</span>
          <span className=" text-gray-900">Rs. 400</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-gray-300 pt-4">
        <h3 className="text-lg font-bold">Total <span className="text-sm font-normal text-gray-500">(Incl. Tax)</span></h3>
        <span className="text-lg font-bold">Rs. {data?.menuItems?.reduce((acc: number, item: any) => acc + (item?.menuItemId?.price || 0), 0) + 400}</span>
      </div>
    </div>
  );
}
