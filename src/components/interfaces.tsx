import React from "react";

export interface Listing {
  address: string;
  code: string;
  date: string;
  image: string;
  meal: string;
  name: string;
  orderAvailable: boolean;
  stalls: Stall[];
}

export interface Stall {
  available: boolean;
  food: Food[];
  name: string;
  stallId: string;
}

interface Food {
  available: boolean;
  description: string;
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
}