export const clients: {
  name: string;
  org: string;
  diocese?: string;
  photo?: string;
  /** CSS object-position for the photo, e.g. "50% 20%" to bias toward the top */
  photoPosition?: string;
  /** CSS scale to zoom in on the face when it's small/far in the source photo */
  photoZoom?: number;
}[] = [
  {
    name: "Fr. Nicholas Fleming, Pastor",
    org: "Ss. John and James Catholic Parish, West Warwick, RI",
    diocese: "Diocese of Providence",
    photo: "/images/clients/fr-nicholas-fleming.jpg",
    photoPosition: "50% 20%",
    photoZoom: 1.8,
  },
  {
    name: "Fr. Jared DeLeo, Pastor",
    org: "St. Monica Catholic Parish, Palatka, FL",
    diocese: "Diocese of St. Augustine",
    photo: "/images/clients/fr-jared-de-leo.jpg",
    photoPosition: "50% 15%",
  },
  {
    name: "Fr. Dalton Rodgers, Pastor",
    org: "St. Joseph Catholic Parish, Los Banos, CA",
    diocese: "Diocese of Fresno",
    photo: "/images/clients/fr-dalton-rodgers.png",
  },
  {
    name: "Fr. Robert Hale, Pastor",
    org: "St. Rose Family of Parishes, Springfield, OH",
    diocese: "Archdiocese of Cincinnati",
    photo: "/images/clients/fr-robert-hale.jpg",
  },
  {
    name: "Fr. Dave Aufiero, Pastor",
    org: "St. Patrick's Catholic Church, South Hadley, MA",
    diocese: "Diocese of Springfield, MA",
    photo: "/images/clients/fr-dave-aufiero.jpg",
  },
  {
    name: "Fr. William Bond, Pastor",
    org: "Our Lady of the Saints Family of Parishes, Omaha, NE",
    diocese: "Archdiocese of Omaha",
    photo: "/images/clients/fr-william-bond.png",
    photoPosition: "50% 10%",
    photoZoom: 1.2,
  },
  {
    name: "Fr. Nathan Linton, Vocations Director",
    org: "Capuchins, Midwest Province of St. Joseph",
    photo: "/images/clients/fr-nathan-linton.jpg",
    photoPosition: "35% 10%",
    photoZoom: 1.15,
  },
  {
    name: "Bishop Daniel Mueggenborg",
    org: "",
    diocese: "Diocese of Reno",
    photo: "/images/clients/diocese-of-reno/photo.jpg",
    photoPosition: "48% 15%",
    photoZoom: 1.6,
  },
  {
    name: "Fr. Zach Weber",
    org: "UW Oshkosh Newman Center",
    diocese: "Diocese of Green Bay",
    photo: "/images/clients/fr-zach-weber.jpg",
    photoPosition: "50% 0%",
    photoZoom: 1.3,
  },
];
