export type Tags = {
  id: number;
  tag: string;
};

export type EventTicketType = {
  id: number;
  title: string;
  price: number;
  available_tickets: number;
  ticket_type_banner: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  event: number;
};

type Organization = {
  organization_name: string;
};

export interface ProductAttributeType {
  id: number;
  value: string;
}

export interface ProductType {
  id: number;
  is_active: boolean;
  name: string;
  price: number;
  image: string;
  rating: number;
  attributes: {
    color: ProductAttributeType[];
    size: ProductAttributeType[];
    product_type: ProductAttributeType;
  };
}

export type EventType = {
  id: number;
  title: string;
  banner: string;
  expired: boolean;
  organization: Organization;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  is_active: boolean;
  tags: Array<Tags>;
  eventTicketTypes?: Array<EventTicketType>;
  floor_plan: string;
  updated_at: string;
  instagram_url: string;
  meta_url: string;
  x_url: string;
};

export type CarouselType = {
  image: string;
  title: string;
  description: string;
};

export type UserType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_event_admin: boolean;
  profile_id: number;
};

export type AttendeeInfoType = {
  quantity?: number;
  ticket_name?: string;
  amount_paid?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  event?: number;
  ticket_type?: number;
  RF_id?: string | null;
};

export type InvoiceResponseType = {
  id: number;
  invoice_number: string;
  data: {
    attendeeInfo: AttendeeInfoType[];
    payment: PaymentType;
  };
  total_amount: number;
};

export type PaymentType = Partial<{
  id: number;
  amount: number;
  method: string;
  phone: string;
  email_to: string;
}> &
  Partial<InitiatePaymentResponseType>;

export type InitiatePaymentResponseType = {
  id: number;
  invoice_number: string;
  total_amount: number;
  phone: string;
  fcm_token?: string | null;
  payment_status: string;
  primary_email: string;
};

export type CreateInvoiceDataType = {
  data: {
    attendeeInfo: AttendeeInfoType[];
  };
  payment?: PaymentType;
};

export type MerchType = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  attributes: AttributeType;
};

type AttributeType = {
  color: {
    id: number;
    value: string;
  }[];
  size: {
    id: number;
    value: string;
  }[];
  product_type: {
    id: number;
    value: string;
  };
};
export interface KycDataType {
  [key: string]: any;
}

export interface EventDataType {
  id: number;
  [key: string]: any;
}

export interface TicketTypeDataType {
  [key: string]: any;
}

export interface ApiResponseType<T> {
  data: T;
}

export interface RejectWithValueType {
  rejectWithValue: (value: any) => any;
}

export interface EventUpdateDataType {
  eventId: number;
  data: KycDataType;
}

export interface ProfileUpdateDataType {
  profileId: number;
  data: KycDataType;
}

export type TicketStatType = {
  ticket_id: number;
  ticket_code: string;
  invoice_id: number;
  mpesa_receipt_number: string;
  invoice_number: string;
};

export type EventTicketStatType = {
  ticket_type: string;
  total_revenue: number;
  ticket_count: number;
  tickets: TicketStatType[];
};

export type Event = {
  event_id: number;
  event_title: string;
  sub_total: number;
  ticket_types: EventTicketStatType[];
};

export type AnalyticsDataType = {
  events: Event[];
  grand_total: number;
};
