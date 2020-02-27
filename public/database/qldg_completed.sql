-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2019 at 03:11 PM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qldg`
--

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_ra_gia`
--

CREATE TABLE `chi_tiet_ra_gia` (
  `san_pham_id` int(11) DEFAULT NULL,
  `nguoi_dung_id` int(11) DEFAULT NULL,
  `gia` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `thoi_diem_ra_gia` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int(11) NOT NULL,
  `ten_dang_nhap` varchar(45) DEFAULT NULL,
  `mat_khau` varchar(255) DEFAULT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `quyen_han` int(11) DEFAULT NULL,
  `diem_danh_gia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `ten_dang_nhap`, `mat_khau`, `ten`, `email`, `ngay_sinh`, `quyen_han`, `diem_danh_gia`) VALUES
(11, 'user', '$2a$10$PgOpfgQ0cCWCbbol.fHIYumtCCYOHZdVZeFXrmOC1BIBDju5cI2cK', 'user', 'user@gmail.com', '1999-01-12', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `phan_hoi`
--

CREATE TABLE `phan_hoi` (
  `nguoi_dung_id` int(11) NOT NULL,
  `san_pham_id` int(11) NOT NULL,
  `noi_dung` varchar(45) DEFAULT NULL,
  `thoi_diem` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `phan_loai`
--

CREATE TABLE `phan_loai` (
  `id_loai` int(11) NOT NULL,
  `ten_loai` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `phan_loai`
--

INSERT INTO `phan_loai` (`id_loai`, `ten_loai`) VALUES
(1, 'Điện thoại di động'),
(2, 'Máy tính xách tay');

-- --------------------------------------------------------

--
-- Table structure for table `ptgn`
--

CREATE TABLE `ptgn` (
  `id` int(11) NOT NULL,
  `ten_ptgn` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `san_pham`
--

CREATE TABLE `san_pham` (
  `id` int(11) NOT NULL,
  `ten_sp` varchar(70) DEFAULT NULL,
  `kich_co` varchar(70) DEFAULT NULL,
  `trong_luong` varchar(45) DEFAULT NULL,
  `tinh_trang` varchar(45) DEFAULT NULL,
  `gia_khoi_diem` int(11) DEFAULT NULL,
  `ngay_het_han` datetime DEFAULT NULL,
  `gia_ban_toi_thieu` int(11) DEFAULT NULL,
  `gia_hien_tai` int(11) DEFAULT NULL,
  `nguoi_ban_id` int(11) DEFAULT NULL,
  `nguoi_thang_id` int(11) DEFAULT NULL,
  `ngay_dang` datetime DEFAULT NULL,
  `chung_loai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `san_pham`
--

-- --------------------------------------------------------

--
-- Table structure for table `tu_choi_ra_gia`
--

CREATE TABLE `tu_choi_ra_gia` (
  `san_pham_id` int(11) DEFAULT NULL,
  `nguoi_dung_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

INSERT INTO `san_pham` (`id`, `ten_sp`, `kich_co`, `trong_luong`, `tinh_trang`, `gia_khoi_diem`, `ngay_het_han`, `gia_ban_toi_thieu`, `gia_hien_tai`, `nguoi_ban_id`, `nguoi_thang_id`, `ngay_dang`, `chung_loai`) VALUES
(1, 'Điện Thoại iPhone 11 Pro Max 64GB', '158 x 77.8 x 8.1 mm', '226g', NULL, 30490000, NULL, 30490000, 30490000, 1, NULL, NULL, 1),
(2, 'Điện Thoại iPhone 11 Pro Max 256GB', '158 x 77.8 x 8.1 mm', '226g', NULL, 34990000, NULL, 34990000, 34990000, 1, NULL, NULL, 1),
(3, 'Điện Thoại iPhone 11 64GB - Hàng Nhập Khẩu', '150.9 x 75.7 x 8.3 mm', '194g', NULL, 17490000, NULL, 17490000, 17490000, 1, NULL, NULL, 1),
(4, 'Điện Thoại iPhone 7 Plus 128GB - Hàng Nhập Kh', 'Dài 158.2mm - Ngang 77.9mm - Dày 7.3mm', '188g', NULL, 12490000, NULL, 12490000, 12490000, 2, NULL, NULL, 1),
(5, 'Điện Thoại iPhone XS Max 256GB - Hàng Chính H', '15.75 x 7.74 x 0.77 cm', '208g', NULL, 26990000, NULL, 26990000, 26990000, 2, NULL, NULL, 1),
(6, 'Điện Thoại Samsung Galaxy M10 (16GB/2GB) - Hà', '155.6 x 75.6 x 7.7 mm', '163g', NULL, 2350000, NULL, 2350000, 2350000, 3, NULL, NULL, 1),
(7, 'Điện Thoại Samsung Galaxy A50s (64GB/4GB) ', 'Dài 158.5 mm - Ngang 74.7 mm - Dày 7.7 mm', '166g', NULL, 5390000, NULL, 5390000, 5390000, 1, NULL, NULL, 1),
(8, 'Điện Thoại Samsung Galaxy A70 (128GB/6GB) - H', '164.3 x 76.7 x 7.9 mm', '166g', NULL, 7150000, NULL, 7150000, 7150000, NULL, NULL, NULL, 1),
(9, 'Điện Thoại Asus Zenfone Max Pro M2 (3GB/32GB)', 'Dài 157.9 mm - Ngang 75.5 mm - Dày 8.5 mm', '175g', NULL, 4390000, NULL, 4390000, 4390000, NULL, NULL, NULL, 1),
(10, 'Điện Thoại Xiaomi Redmi 7A (2GB/16GB) - Hàng ', 'Dài 146.3 mm - Ngang 70.41 mm - Dày 9.55 mm', '150g', NULL, 1780000, NULL, 1780000, 1780000, NULL, NULL, NULL, 1),
(11, 'Macbook Pro 13 Touch 2019', '1.49 cm x 30.41 cm x 21.24 cm', '1.37kg', NULL, 36990000, NULL, 36990000, 36990000, NULL, NULL, NULL, 2),
(12, 'Dell Vostro 3580-V5I3058W (Black)', '19.9mm x 339mm x 241.9 mm', '2.16kg', NULL, 11790000, NULL, 11790000, 11790000, NULL, NULL, NULL, 2),
(13, 'Dell Inspiron 3580-70188447 (Black)', '22.7mm x 380mm x 258 mm', '2.19kg', NULL, 19990000, NULL, 19990000, 19990000, NULL, NULL, NULL, 2),
(14, 'Dell G7 Inspiron 7591-N5I5591W (Grey)', '17.94mm ~ 19.90mm x 357.56mm x 238.84mm', '1.87kg', NULL, 24700000, NULL, 24700000, 24700000, NULL, NULL, NULL, 2),
(15, 'Asus Vivobook S430FN-BEB032T (Gold)', NULL, '1.4kg', NULL, 17990000, NULL, 17990000, 17990000, NULL, NULL, NULL, 2),
(16, 'Asus Zenbook UX434FAC-A6116T (Silver-Sreenpad)', 'Weight & Dimension: 31.9(W) x 19.9(D) x 1.59 ~ 1.59 (H) cm', '1.1kg', NULL, 23490000, NULL, 23490000, 23490000, NULL, NULL, NULL, 2),
(17, 'ASUS ROG GL553VD i5-7300HQ', '383 x 255 x 30 mm (WxDxH)', '2.5kg', NULL, 22490000, NULL, 22490000, 22490000, NULL, NULL, NULL, 2),
(18, 'Asus P5440FA-BM0557T (Grey)', '326 x 229,3 x 10,1 ~ 18,5 mm (WxDxH)', '1.23kg', NULL, 21390000, NULL, 21390000, 21390000, NULL, NULL, NULL, 2),
(19, 'Dell G3 3579-G5I5423W (Black)', NULL, '2.3kg', NULL, 22700000, NULL, 22700000, 22700000, NULL, NULL, NULL, 2),
(20, 'MSI GF75 9SC-447VN', NULL, '2.2kg', NULL, 26600000, NULL, 26600000, 26600000, NULL, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `san_pham_has_ptgn`
--

CREATE TABLE `san_pham_has_ptgn` (
  `san_pham_id` int(11) NOT NULL,
  `PTGN_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chi_tiet_ra_gia`
--
ALTER TABLE `chi_tiet_ra_gia`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `tu_choi_ra_gia`
--
ALTER TABLE `tu_choi_ra_gia`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phan_hoi`
--
ALTER TABLE `phan_hoi`
  ADD PRIMARY KEY (`nguoi_dung_id`,`san_pham_id`);

--
-- Indexes for table `phan_loai`
--
ALTER TABLE `phan_loai`
  ADD PRIMARY KEY (`id_loai`);

--
-- Indexes for table `ptgn`
--
ALTER TABLE `ptgn`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `san_pham_has_ptgn`
--
ALTER TABLE `san_pham_has_ptgn`
  ADD PRIMARY KEY (`san_pham_id`,`PTGN_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chi_tiet_ra_gia`
--
ALTER TABLE `chi_tiet_ra_gia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


--
-- AUTO_INCREMENT for table `tu_choi_ra_gia`
--
ALTER TABLE `tu_choi_ra_gia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


--
-- AUTO_INCREMENT for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
