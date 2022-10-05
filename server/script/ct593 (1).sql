-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 05, 2022 at 05:15 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ct593`
--

-- --------------------------------------------------------

--
-- Table structure for table `binh_luan`
--

CREATE TABLE `binh_luan` (
  `bl_id` int(11) NOT NULL,
  `bl_noidung` text NOT NULL,
  `bl_danhgia` int(11) DEFAULT NULL,
  `bl_thoigian` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bl_trangthai` int(11) DEFAULT NULL,
  `kh_id` int(11) NOT NULL,
  `sp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_hoa_don`
--

CREATE TABLE `chi_tiet_hoa_don` (
  `cthd_id` int(11) NOT NULL,
  `cthd_giaban` float NOT NULL,
  `hd_id` int(11) NOT NULL,
  `sp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_phieu_nhap`
--

CREATE TABLE `chi_tiet_phieu_nhap` (
  `ctpn_id` int(11) NOT NULL,
  `ctpn_idsp` int(11) NOT NULL,
  `ctpn_soluong` int(11) NOT NULL,
  `ctpn_gia` float NOT NULL,
  `ctpn_idpn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chi_tiet_phieu_nhap`
--

INSERT INTO `chi_tiet_phieu_nhap` (`ctpn_id`, `ctpn_idsp`, `ctpn_soluong`, `ctpn_gia`, `ctpn_idpn`) VALUES
(1, 18, 1, 1000, 1),
(2, 17, 17, 10000, 1),
(3, 19, 18, 12000, 1),
(4, 17, 150, 50000, 2),
(5, 18, 150, 64000, 2),
(6, 19, 150, 72000, 2);

-- --------------------------------------------------------

--
-- Table structure for table `danh_muc`
--

CREATE TABLE `danh_muc` (
  `dm_id` int(11) NOT NULL,
  `dm_ten` varchar(250) NOT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `danh_muc`
--

INSERT INTO `danh_muc` (`dm_id`, `dm_ten`, `active`) VALUES
(1, 'Văn Học', 1),
(2, 'Kinh Tế', 1),
(3, 'Sách Thiếu Nhi', 1),
(4, 'Tiểu Sử - Hồi Ký', 1),
(5, 'Tâm Lý - Kỹ Năng Sống', 1),
(6, 'Nuôi Dạy Con', 1),
(7, 'Sách Giáo Khoa - Tham Khảo', 1),
(8, 'Sách Mới', 1),
(9, 'Sách Bán Chạy', 1);

-- --------------------------------------------------------

--
-- Table structure for table `dia_chi`
--

CREATE TABLE `dia_chi` (
  `dc_id` int(11) NOT NULL,
  `dc_tenkh` varchar(100) NOT NULL,
  `dc_sdt` int(12) NOT NULL,
  `dc_diachi` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `hinh_anh`
--

CREATE TABLE `hinh_anh` (
  `ha_id` int(11) NOT NULL,
  `ha_hinh` varchar(250) NOT NULL,
  `ha_idsp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hinh_anh`
--

INSERT INTO `hinh_anh` (`ha_id`, `ha_hinh`, `ha_idsp`) VALUES
(13, 'sp_hinhanh-1664851338782.jpg', 17),
(14, 'sp_hinhanh-1664851338802.jpg', 17),
(15, 'sp_hinhanh-1664851338810.jpg', 17),
(16, 'sp_hinhanh-1664851858473.jpg', 18),
(17, 'sp_hinhanh-1664851858475.jpg', 18),
(18, 'sp_hinhanh-1664851858488.jpg', 18),
(19, 'sp_hinhanh-1664852213265.jpg', 19),
(20, 'sp_hinhanh-1664852213268.jpg', 19),
(21, 'sp_hinhanh-1664852213274.jpg', 19),
(22, 'sp_hinhanh-1664852213280.jpg', 19),
(23, 'sp_hinhanh-1664852213284.jpg', 19),
(24, 'sp_hinhanh-1664852213287.jpg', 19),
(25, 'sp_hinhanh-1664852213292.jpg', 19),
(26, 'sp_hinhanh-1664852213295.jpg', 19),
(27, 'sp_hinhanh-1664852397519.jpg', 20),
(28, 'sp_hinhanh-1664852397523.jpg', 20),
(29, 'sp_hinhanh-1664852397528.jpg', 20),
(30, 'sp_hinhanh-1664852397537.jpg', 20),
(31, 'sp_hinhanh-1664852397544.jpg', 20);

-- --------------------------------------------------------

--
-- Table structure for table `hoa_don`
--

CREATE TABLE `hoa_don` (
  `hd_id` int(11) NOT NULL,
  `hd_pttt` varchar(20) NOT NULL,
  `hd_tongtien` float NOT NULL,
  `nv_id` int(11) NOT NULL,
  `tt_id` int(11) NOT NULL,
  `kh_id` int(11) NOT NULL,
  `vc_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `khach_hang`
--

CREATE TABLE `khach_hang` (
  `kh_id` int(11) NOT NULL,
  `kh_ten` varchar(250) NOT NULL,
  `kh_email` varchar(100) NOT NULL,
  `kh_matkhau` varchar(11) NOT NULL,
  `kh_sdt` varchar(12) NOT NULL,
  `kh_namsinh` date NOT NULL,
  `kh_gioitinh` int(11) NOT NULL,
  `kh_trangthai` int(11) DEFAULT NULL,
  `kh_hinhdaidien` varchar(50) DEFAULT NULL,
  `dc_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `khuyen_mai`
--

CREATE TABLE `khuyen_mai` (
  `km_id` int(11) NOT NULL,
  `km_ten` varchar(100) NOT NULL,
  `km_phantramgiam` int(11) NOT NULL,
  `km_ngaybatdau` date NOT NULL,
  `km_ngayketthuc` date NOT NULL,
  `sp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ngon_ngu`
--

CREATE TABLE `ngon_ngu` (
  `nn_id` int(11) NOT NULL,
  `nn_ten` varchar(250) NOT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ngon_ngu`
--

INSERT INTO `ngon_ngu` (`nn_id`, `nn_ten`, `active`) VALUES
(1, 'Tiếng Anh', 1),
(4, 'Tiếng Việt', 1);

-- --------------------------------------------------------

--
-- Table structure for table `nhan_vien`
--

CREATE TABLE `nhan_vien` (
  `nv_id` int(11) NOT NULL,
  `nv_ten` varchar(250) NOT NULL,
  `nv_email` varchar(250) NOT NULL,
  `nv_matkhau` varchar(100) NOT NULL,
  `nv_sdt` varchar(12) NOT NULL,
  `nv_namsinh` date NOT NULL,
  `nv_gioitinh` int(11) NOT NULL,
  `nv_trangthai` int(11) NOT NULL,
  `nv_hinhanh` varchar(250) NOT NULL,
  `q_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `nha_cung_cap`
--

CREATE TABLE `nha_cung_cap` (
  `ncc_id` int(11) NOT NULL,
  `ncc_ten` varchar(250) NOT NULL,
  `ncc_email` varchar(250) DEFAULT NULL,
  `ncc_sdt` varchar(12) DEFAULT NULL,
  `ncc_diachi` varchar(250) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `nha_cung_cap`
--

INSERT INTO `nha_cung_cap` (`ncc_id`, `ncc_ten`, `ncc_email`, `ncc_sdt`, `ncc_diachi`, `active`) VALUES
(1, 'Nhà xuất bản Phụ nữ Việt Nam', 'phongphathanhnxbpn@gmail.com', '024 39 712 8', '39 Hàng Chuối, Hai Bà Trưng, Hà Nội', 1),
(2, 'Nhà xuất bản Đại học Quốc gia Thành phố Hồ Chí Minh', 'ttmtien.nxb@vnuhcm.edu.vn', '028 6681 705', 'Phòng 501, Nhà Điều hành ĐHQG-HCM, Phường Linh Trung, Quận Thủ Đức, TP. Hồ Chí Minh', 1),
(3, 'Nhà xuất bản Kim đồng', 'info@nxbkimdong.com.vn', '0243 943 44 ', '55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội', 1),
(4, 'Nhà sách Hồng Ân', 'nhasachhongan@hotmail.com', '028 3824 670', '20C Nguyễn Thị Minh Khai, Đa Kao, Quận 1, Hồ Chí Minh', 1),
(5, 'Saigon Books', 'nhasachhongan@hotmail.com', '028 34534 87', '473/8 Tô Hiến Thành , Q10, TPHCM', 1),
(6, 'Công ty CP SBooks', 'NULL', 'NULL', '52 đường 26 Kp 5. Phường Hiệp Bình Chánh, Quận Thủ Đức, Tp Hồ Chí Minh', 1),
(7, 'CÔNG TY TNHH SÁCH WABOOKS', 'info@wabooks.vn', '0838101000', '36 Hoàng Cầu, Chợ Dừa, Đống Đa, Hà Nội', 1),
(8, 'Minh Long Book', '\r\nminhlongbook@gmail.com', '024 7300 837', 'LK 02 - 03, Dãy B, KĐT Green Pearl, 378 Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(9, 'Panda Books', 'support@pandabooks.vn', '02473086066', '1 NV7 Khu liền kề Green Park ngõ 319 Vĩnh Hưng, Phường Thanh Trì, Q.Hoàng Mai, Hà Nội', 1),
(10, 'NXB Thế giới', 'thegioi@thegioipublishers.vn ', '04 3825 3841', '46 Trần Hưng Đạo, phường Hàng Bài, quận Hoàn Kiếm, TP. Hà Nội, Việt Nam', 1),
(11, 'NHÀ SÁCH VĂN LANG', 'nsvanlanghanoi@gmail.com', '0972074925', 'Số 4 Ngõ 1 Phùng Chí Kiên, Quan Hoa, Cầu Giấy, Hà Nội', 1),
(12, 'Thái Hà Books', '\r\nnhasachthaiha@thaihabooks.com', '024 6281 363', 'Lô B2, khu đấu giá 3ha, phường Phúc Diễn, quận Bắc Từ Liêm, Hà Nội', 1),
(13, 'Nhà xuất bản Bách Khoa - Hà Nội', '\r\nnxbbk@hust.edu.vn', '024.3868.456', '\r\nNgõ 17 Tạ Quang Bửu - Hai Bà Trưng - Hà Nội', 1),
(14, 'Đinh Tị Books', 'contacts@dinhtibooks.com.vn', '0247 309 338', 'Nhà NV22 khu dự án Handico - Ngõ 13 Lĩnh Nam - P. Mai Động - Q. Hoàng Mai - TP. Hà Nội', 1),
(15, 'AMAIN BOOKS', 'aied.ad2020@gmail.com', '024 3212 320', 'Tầng 5 số 35 ngõ 66 đường Dịch Vọng Hậu, P. Dịch Vọng Hậu, Q. Cầu Giấy, TP. Hà Nội', 1),
(16, 'ĐCÔNG TY CP VĂN HÓA HUY HOÀNG', 'huyhoangbook.mp@gmail.com', '0283.991.363', '357A Lê Văn Sỹ - P.1 - Q.Tân Bình - TP.HCM', 1),
(17, 'HOCMAIBOOK', '\r\nhocmaibooks@hocmai.vn', '\r\n0963 028 0', '\r\nTầng 4, tòa 25T2 Nguyễn Thị Thập, Trung Hòa, Cầu Giấy, Hà Nội', 1),
(18, 'Zenbooks', '\r\nthuongnx@zenbooks.vn', '0933988239', '268 Tô Hiến Thành (BigC Tô Hiến Thành) Phường 15 Quận 10, Tp.HCM', 1),
(19, 'Wiselands', '\r\nwiselandscoffee@gmail.com', '0901233623', '17 Hạ Hồi, P. Trần Hưng Đạo, Q. Hoàn Kiếm, Hà Nội', 1),
(20, 'Nhà sách Tri thức trẻ Books', 'kinhdoanh.trithuctrebooks@gmail.com', '02439726137', 'Số 23, ngách 56, ngõ 376, đường Bưởi, phường Vĩnh Phúc, quận Ba Đình, TP. Hà Nội', 1),
(21, 'Nhà xuất bản Hà Nội', 'vanthu_nxbhn@hanoi.gov.vn', '024.38252916', 'Số 4, phố Tống Duy Tân, phường Hàng Bông, quận Hoàn Kiếm, Hà Nội', 1),
(22, 'CTCP Phát Hành Sách FAHASA', 'hangtruong8990@gmail.com', '0932023284', 'Lầu 5, 387-389 Hai Bà Trưng, Phường 8, Quận 3, TPHCM', 1),
(23, 'Nhà xuất bản Văn học', 'phongkinhdoanh.nxbvh@gmail.com', '024.37161518', '18 Nguyễn Trường Tộ, P.Trúc Bạch, Ba Đình, Hà Nội.', 1),
(24, 'Công ty Cổ phần xuất bản và giáo dục Quảng Văn', 'pr@quangvanbooks.com', '0934641489', 'Số 31, ngõ 150, đường Hoàng Công Chất, phường Phú Diễn, quận Bắc Từ Liêm, Tp. Hà Nội', 1);

-- --------------------------------------------------------

--
-- Table structure for table `nha_xuat_ban`
--

CREATE TABLE `nha_xuat_ban` (
  `nxb_id` int(11) NOT NULL,
  `nxb_ten` varchar(250) NOT NULL,
  `nxb_email` varchar(100) DEFAULT NULL,
  `nxb_sdt` varchar(12) DEFAULT NULL,
  `nxb_diachi` varchar(250) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `nha_xuat_ban`
--

INSERT INTO `nha_xuat_ban` (`nxb_id`, `nxb_ten`, `nxb_email`, `nxb_sdt`, `nxb_diachi`, `active`) VALUES
(1, 'Nhà xuất bản Thanh niên', 'nxbtn@gmail.com', '028 3910 696', '143 Pasteur, Phường 6, Quận 3, Thành phố Hồ Chí Minh', 1),
(2, ' Nhà xuất bản Lao động', 'nxbld@gmail.com', '024 3851 538', '175 P. Giảng Võ, Chợ Dừa, Đống Đa, Hà Nội', 1),
(3, 'Nhà xuất bản Phụ nữ', 'nxbphunu@gmail.com', '024 3971 071', '39 P. Hàng Chuối, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội', 1),
(4, 'Nhà xuất bản Mỹ thuật', 'nxbmythuat@gmail.com', '0965.728.039', '28 N P. Trần Quý Cáp, Văn Miếu, Hoàn Kiếm, Hà Nội', 1),
(5, 'Nhà xuất bản Sân khấu', 'nxbsankhau@gmail.com', '024 3786 638', '51 Trần Hưng Đạo, Hàng Bài, Hoàn Kiếm, Hà Nội', 1),
(6, 'Nhà xuất bản Hội nhà văn', 'nxbhoinhavan65@gmail.com', '024 3822.213', 'SỐ 65 NGUYỄN DU, QUẬN HAI BÀ TRƯNG, HÀ NỘI', 1),
(7, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(8, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(9, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(10, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(11, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(12, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(13, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(14, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(15, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(16, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(17, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(18, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(19, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(20, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(21, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(22, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(23, 'Nhà xuất bản Thể dục thể thao', 'banbientap@bvhttdl.gov.vn', '028 3910 641', '48 Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(24, 'Nhà xuất bản Y học', 'xuatbanyhoc@fpt.vn', '0934547168', 'Số 352 Đội Cấn, Phường Cống Vị, Quận Ba Đình, TP Hà Nội', 1),
(25, 'Nhà xuất bản Xây dựng', 'banhang@nxbxaydung.com.vn', '024 3821 878', '5 P. Hoa Lư, Lê Đại Hành, Hai Bà Trưng, Hà Nội', 1),
(26, 'Nhà xuất bản Từ điển bách khoa', 'banbientap@vass.gov.vn', '024 3733 927', '109 P. Quán Thánh, Quán Thánh, Ba Đình, Hà Nội', 1),
(27, 'Nhà xuất bản Tri thức', 'lienhe@nxbtrithuc.com.vn', '024 3945 466', 'Tầng 1, Tòa nhà VUSTA, 53, Nguyễn Du, Hai Bà Trưng, Hà Nội', 1),
(28, 'Nhà xuất bản Thế giới', 'thegioi@hn.vnn.vn', '028 3822 010', '7 Nguyễn Thị Minh Khai, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 1),
(29, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(30, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(31, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(32, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(33, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(34, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(35, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(36, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(37, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(38, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(39, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(40, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(41, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(42, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(43, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(44, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(45, 'Nhà xuất bản Khoa học tự nhiên và Công nghệ', 'nxb@vap.ac.vn', '024 2214 904', '18B Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội', 1),
(46, 'Nhà xuất bản Nông nghiệp', 'nxbnongnghiep@gmail.com', '028 3911 160', '58 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(47, 'Nhà xuất bản Thống kê', 'xuatbanthongke.kd@gmail.com', '024 3845 729', '86-98 Đ. Thụy Khuê, Thuỵ Khuê, Tây Hồ, Hà Nội', 1),
(48, 'Nhà xuất bản Tài chính', 'info@fph.gov.vn', '02438262767', 'Số 7 Phan Huy Chú, quận Hoàn Kiếm, thành phố Hà Nội', 1),
(49, 'Nhà xuất bản Thể dục thể thao', 'banbientap@bvhttdl.gov.vn', '028 3910 641', '48 Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(50, 'Nhà xuất bản Y học', 'xuatbanyhoc@fpt.vn', '0934547168', 'Số 352 Đội Cấn, Phường Cống Vị, Quận Ba Đình, TP Hà Nội', 1),
(51, 'Nhà xuất bản Xây dựng', 'banhang@nxbxaydung.com.vn', '024 3821 878', '5 P. Hoa Lư, Lê Đại Hành, Hai Bà Trưng, Hà Nội', 1),
(52, 'Nhà xuất bản Từ điển bách khoa', 'banbientap@vass.gov.vn', '024 3733 927', '109 P. Quán Thánh, Quán Thánh, Ba Đình, Hà Nội', 1),
(53, 'Nhà xuất bản Tri thức', 'lienhe@nxbtrithuc.com.vn', '024 3945 466', 'Tầng 1, Tòa nhà VUSTA, 53, Nguyễn Du, Hai Bà Trưng, Hà Nội', 1),
(54, 'Nhà xuất bản Thế giới', 'thegioi@hn.vnn.vn', '028 3822 010', '7 Nguyễn Thị Minh Khai, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 1),
(55, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(56, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(57, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(58, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(59, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(60, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(61, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(62, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(63, 'Nhà xuất bản Khoa học tự nhiên và Công nghệ', 'nxb@vap.ac.vn', '024 2214 904', '18B Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội', 1),
(64, 'Nhà xuất bản Nông nghiệp', 'nxbnongnghiep@gmail.com', '028 3911 160', '58 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(65, 'Nhà xuất bản Thống kê', 'xuatbanthongke.kd@gmail.com', '024 3845 729', '86-98 Đ. Thụy Khuê, Thuỵ Khuê, Tây Hồ, Hà Nội', 1),
(66, 'Nhà xuất bản Tài chính', 'info@fph.gov.vn', '02438262767', 'Số 7 Phan Huy Chú, quận Hoàn Kiếm, thành phố Hà Nội', 1),
(67, 'Nhà xuất bản Thể dục thể thao', 'banbientap@bvhttdl.gov.vn', '028 3910 641', '48 Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(68, 'Nhà xuất bản Y học', 'xuatbanyhoc@fpt.vn', '0934547168', 'Số 352 Đội Cấn, Phường Cống Vị, Quận Ba Đình, TP Hà Nội', 1),
(69, 'Nhà xuất bản Xây dựng', 'banhang@nxbxaydung.com.vn', '024 3821 878', '5 P. Hoa Lư, Lê Đại Hành, Hai Bà Trưng, Hà Nội', 1),
(70, 'Nhà xuất bản Từ điển bách khoa', 'banbientap@vass.gov.vn', '024 3733 927', '109 P. Quán Thánh, Quán Thánh, Ba Đình, Hà Nội', 1),
(71, 'Nhà xuất bản Tri thức', 'lienhe@nxbtrithuc.com.vn', '024 3945 466', 'Tầng 1, Tòa nhà VUSTA, 53, Nguyễn Du, Hai Bà Trưng, Hà Nội', 1),
(72, 'Nhà xuất bản Thế giới', 'thegioi@hn.vnn.vn', '028 3822 010', '7 Nguyễn Thị Minh Khai, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 1),
(73, 'Nhà xuất bản Âm nhạc', 'nxbamnhac@gmail.com', '0987 64 39 3', 'Số 86 ngõ 189 Hoàng Hoa Thám - P. Liễu Giai, Q. Ba Đình, Hà nội', 1),
(74, 'Nhà xuất bản Văn học', 'info@nxbvanhoc.com.vn', '028 3846 985', '20 Đ. Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, Thành phố Hồ Chí Minh', 1),
(75, 'Nhà xuất bản Văn hoá dân tộc', 'banbientap@bvhttdl.gov.vn', '024 3826 307', '19 Phố Nguyễn Bỉnh Khiêm, Phường Nguyễn Du, Quận Hai Bà Trưng, Thành Phố', 1),
(76, 'Nhà xuất bản Văn hoá - Thông tin', 'nxbvhtt@gmail.com', '02439719512', 'Số 43 Lò Đúc, Quận Hai Bà Trưng, TP. Hà Nội', 1),
(77, 'Nhà xuất bản Lý luận chính trị', 'nxbllct@gmail.com', ' 024 3513130', '66 phường Mai Dịch, quận Cầu Giấy, Hà Nội', 1),
(78, 'Nhà xuất bản Đại học kinh tế quốc dân', 'nxb@neu.edu.vn', '024 3628 248', '207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội', 1),
(79, 'Nhà xuất bản Đại học Bách khoa Hà Nội', 'nxbbk@hust.edu.vn', '024 38684569', 'Nhà E – Ngõ 17 – Tạ Quang Bửu – Hai Bà Trưng – Hà Nội', 1),
(80, 'Nhà xuất bản Đại học Huế', 'nxbdhhue@hue.uni.edu.vn', '0234 3834 48', '7 Hà Nội, Vĩnh Ninh, Tp. Huế, Huế', 1),
(81, 'Nhà xuất bản Đại học Quốc gia Hà Nội', 'nhaxuatbandhqghanoi@gmail.com', '024 3971 489', '16 P. Hàng Chuối, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội', 1),
(82, 'Nhà xuất bản Đại học sư phạm', 'hanhchinh.nxb@hnue.edu.vn', '024 3754 773', '136 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 1),
(83, 'Nhà xuất bản Đại học Quốc gia thành phố Hồ Chí Minh', 'phathanh.nxb@vnuhcm.edu.vn', '028 6681 705', 'Phòng 501, Nhà Điều hành ĐHQG-HCM, phường Linh Trung, quận Thủ Đức, TP Hồ Chí Minh', 1),
(84, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(85, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(86, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(87, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(88, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(89, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(90, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(91, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(92, 'Nhà xuất bản Khoa học tự nhiên và Công nghệ', 'nxb@vap.ac.vn', '024 2214 904', '18B Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội', 1),
(93, 'Nhà xuất bản Nông nghiệp', 'nxbnongnghiep@gmail.com', '028 3911 160', '58 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(94, 'Nhà xuất bản Thống kê', 'xuatbanthongke.kd@gmail.com', '024 3845 729', '86-98 Đ. Thụy Khuê, Thuỵ Khuê, Tây Hồ, Hà Nội', 1),
(95, 'Nhà xuất bản Tài chính', 'info@fph.gov.vn', '02438262767', 'Số 7 Phan Huy Chú, quận Hoàn Kiếm, thành phố Hà Nội', 1),
(96, 'Nhà xuất bản Thể dục thể thao', 'banbientap@bvhttdl.gov.vn', '028 3910 641', '48 Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(97, 'Nhà xuất bản Y học', 'xuatbanyhoc@fpt.vn', '0934547168', 'Số 352 Đội Cấn, Phường Cống Vị, Quận Ba Đình, TP Hà Nội', 1),
(98, 'Nhà xuất bản Xây dựng', 'banhang@nxbxaydung.com.vn', '024 3821 878', '5 P. Hoa Lư, Lê Đại Hành, Hai Bà Trưng, Hà Nội', 1),
(99, 'Nhà xuất bản Từ điển bách khoa', 'banbientap@vass.gov.vn', '024 3733 927', '109 P. Quán Thánh, Quán Thánh, Ba Đình, Hà Nội', 1),
(100, 'Nhà xuất bản Tri thức', 'lienhe@nxbtrithuc.com.vn', '024 3945 466', 'Tầng 1, Tòa nhà VUSTA, 53, Nguyễn Du, Hai Bà Trưng, Hà Nội', 1),
(101, 'Nhà xuất bản Thế giới', 'thegioi@hn.vnn.vn', '028 3822 010', '7 Nguyễn Thị Minh Khai, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 1),
(102, 'Nhà xuất bản Âm nhạc', 'nxbamnhac@gmail.com', '0987 64 39 3', 'Số 86 ngõ 189 Hoàng Hoa Thám - P. Liễu Giai, Q. Ba Đình, Hà nội', 1),
(103, 'Nhà xuất bản Văn học', 'info@nxbvanhoc.com.vn', '028 3846 985', '20 Đ. Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, Thành phố Hồ Chí Minh', 1),
(104, 'Nhà xuất bản Văn hoá dân tộc', 'banbientap@bvhttdl.gov.vn', '024 3826 307', '19 Phố Nguyễn Bỉnh Khiêm, Phường Nguyễn Du, Quận Hai Bà Trưng, Thành Phố', 1),
(105, 'Nhà xuất bản Văn hoá - Thông tin', 'nxbvhtt@gmail.com', '02439719512', 'Số 43 Lò Đúc, Quận Hai Bà Trưng, TP. Hà Nội', 1),
(106, 'Nhà xuất bản Lý luận chính trị', 'nxbllct@gmail.com', ' 024 3513130', '66 phường Mai Dịch, quận Cầu Giấy, Hà Nội', 1),
(107, 'Nhà xuất bản Đại học kinh tế quốc dân', 'nxb@neu.edu.vn', '024 3628 248', '207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội', 1),
(108, 'Nhà xuất bản Đại học Bách khoa Hà Nội', 'nxbbk@hust.edu.vn', '024 38684569', 'Nhà E – Ngõ 17 – Tạ Quang Bửu – Hai Bà Trưng – Hà Nội', 1),
(109, 'Nhà xuất bản Đại học Huế', 'nxbdhhue@hue.uni.edu.vn', '0234 3834 48', '7 Hà Nội, Vĩnh Ninh, Tp. Huế, Huế', 1),
(110, 'Nhà xuất bản Đại học Quốc gia Hà Nội', 'nhaxuatbandhqghanoi@gmail.com', '024 3971 489', '16 P. Hàng Chuối, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội', 1),
(111, 'Nhà xuất bản Đại học sư phạm', 'hanhchinh.nxb@hnue.edu.vn', '024 3754 773', '136 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 1),
(112, 'Nhà xuất bản Đại học Quốc gia thành phố Hồ Chí Minh', 'phathanh.nxb@vnuhcm.edu.vn', '028 6681 705', 'Phòng 501, Nhà Điều hành ĐHQG-HCM, phường Linh Trung, quận Thủ Đức, TP Hồ Chí Minh', 1),
(113, 'Nhà xuất bản Giáo dục', 'nxbgd@gmail.com', '024 3822 080', '81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(114, 'Nhà xuất bản Đại học Thái Nguyên', 'nxb.dhtn@gmail.com', '0208 3840 02', 'Tân Thịnh, Thành phố Thái Nguyên, Thái Nguyên', 1),
(115, 'Nhà xuất bản Hà Nội', 'vanthu_sovhtt@hanoi.gov.vn', '024 3825 291', '4 P. Tống Duy Tân, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(116, 'Nhà xuất bản Tổng hợp thành phố Hồ Chí Minh', 'nxbthtphcm@gmail.com', '028 3822 534', '62 Nguyễn Thị Minh Khai, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(117, 'Nhà xuất bản Lao động xã hội', 'nxblaodongxahoi@gmail.com', '024 3863 258', 'Số 36 ngõ Hòa Bình 4, Phố Minh Khai, Hai Bà Trưng, Hà Nội', 1),
(118, 'Nhà xuất bản Khoa học xã hội', 'nxbkhxh@gmail.com', '0439719073', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 1),
(119, 'Nhà xuất bản Tôn giáo', 'bantongiaocp@chinhphu.vn', '0243 8 248 6', '53 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(120, 'Nhà xuất bản Thông tấn', 'nhaxuatbanthongtan@vnanet.vn', '024 3933 227', '79 P. Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', 1),
(121, 'Nhà xuất bản Bản đồ', 'nxbbando@gmail.com', '024 3835 927', '85 Đ. Nguyễn Chí Thanh, Thành Công, Đống Đa, Hà Nội', 1),
(122, 'Nhà xuất bản Bưu điện', 'banbientap@mic.gov.vn', '02435563461', '18 Nguyễn Du, Hà Nội', 1),
(123, 'Nhà xuất bản Giao thông', 'nxbgtvt@fpt.vn', '024 3942 874', '80B Trần Hưng Đạo, Hoàn Kiếm, Hà Nộ', 1),
(124, 'Nhà xuất bản Khoa học và kỹ thuật', 'nhaxuatbankhkt@gmail.com', '024 3822 068', '70 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(125, 'Nhà xuất bản Khoa học tự nhiên và Công nghệ', 'nxb@vap.ac.vn', '024 2214 904', '18B Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội', 1),
(126, 'Nhà xuất bản Nông nghiệp', 'nxbnongnghiep@gmail.com', '028 3911 160', '58 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(127, 'Nhà xuất bản Thống kê', 'xuatbanthongke.kd@gmail.com', '024 3845 729', '86-98 Đ. Thụy Khuê, Thuỵ Khuê, Tây Hồ, Hà Nội', 1),
(128, 'Nhà xuất bản Tài chính', 'info@fph.gov.vn', '02438262767', 'Số 7 Phan Huy Chú, quận Hoàn Kiếm, thành phố Hà Nội', 1),
(129, 'Nhà xuất bản Thể dục thể thao', 'banbientap@bvhttdl.gov.vn', '028 3910 641', '48 Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(130, 'Nhà xuất bản Y học', 'xuatbanyhoc@fpt.vn', '0934547168', 'Số 352 Đội Cấn, Phường Cống Vị, Quận Ba Đình, TP Hà Nội', 1),
(131, 'Nhà xuất bản Xây dựng', 'banhang@nxbxaydung.com.vn', '024 3821 878', '5 P. Hoa Lư, Lê Đại Hành, Hai Bà Trưng, Hà Nội', 1),
(132, 'Nhà xuất bản Từ điển bách khoa', 'banbientap@vass.gov.vn', '024 3733 927', '109 P. Quán Thánh, Quán Thánh, Ba Đình, Hà Nội', 1),
(133, 'Nhà xuất bản Tri thức', 'lienhe@nxbtrithuc.com.vn', '024 3945 466', 'Tầng 1, Tòa nhà VUSTA, 53, Nguyễn Du, Hai Bà Trưng, Hà Nội', 1),
(134, 'Nhà xuất bản Thế giới', 'thegioi@hn.vnn.vn', '028 3822 010', '7 Nguyễn Thị Minh Khai, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 1),
(135, 'Nhà xuất bản Âm nhạc', 'nxbamnhac@gmail.com', '0987 64 39 3', 'Số 86 ngõ 189 Hoàng Hoa Thám - P. Liễu Giai, Q. Ba Đình, Hà nội', 1),
(136, 'Nhà xuất bản Văn học', 'info@nxbvanhoc.com.vn', '028 3846 985', '20 Đ. Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, Thành phố Hồ Chí Minh', 1),
(137, 'Nhà xuất bản Văn hoá dân tộc', 'banbientap@bvhttdl.gov.vn', '024 3826 307', '19 Phố Nguyễn Bỉnh Khiêm, Phường Nguyễn Du, Quận Hai Bà Trưng, Thành Phố', 1),
(138, 'Nhà xuất bản Văn hoá - Thông tin', 'nxbvhtt@gmail.com', '02439719512', 'Số 43 Lò Đúc, Quận Hai Bà Trưng, TP. Hà Nội', 1),
(139, 'Nhà xuất bản Lý luận chính trị', 'nxbllct@gmail.com', ' 024 3513130', '66 phường Mai Dịch, quận Cầu Giấy, Hà Nội', 1),
(140, 'Nhà xuất bản Đại học kinh tế quốc dân', 'nxb@neu.edu.vn', '024 3628 248', '207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội', 1),
(141, 'Nhà xuất bản Đại học Bách khoa Hà Nội', 'nxbbk@hust.edu.vn', '024 38684569', 'Nhà E – Ngõ 17 – Tạ Quang Bửu – Hai Bà Trưng – Hà Nội', 1),
(142, 'Nhà xuất bản Đại học Huế', 'nxbdhhue@hue.uni.edu.vn', '0234 3834 48', '7 Hà Nội, Vĩnh Ninh, Tp. Huế, Huế', 1),
(143, 'Nhà xuất bản Đại học Quốc gia Hà Nội', 'nhaxuatbandhqghanoi@gmail.com', '024 3971 489', '16 P. Hàng Chuối, Phạm Đình Hổ, Hai Bà Trưng, Hà Nội', 1),
(144, 'Nhà xuất bản Đại học sư phạm', 'hanhchinh.nxb@hnue.edu.vn', '024 3754 773', '136 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 1),
(145, 'Nhà xuất bản Đại học Quốc gia thành phố Hồ Chí Minh', 'phathanh.nxb@vnuhcm.edu.vn', '028 6681 705', 'Phòng 501, Nhà Điều hành ĐHQG-HCM, phường Linh Trung, quận Thủ Đức, TP Hồ Chí Minh', 1),
(146, 'Nhà xuất bản Giáo dục', 'nxbgd@gmail.com', '024 3822 080', '81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', 1),
(147, 'Nhà xuất bản Đại học Thái Nguyên', 'nxb.dhtn@gmail.com', '0208 3840 02', 'Tân Thịnh, Thành phố Thái Nguyên, Thái Nguyên', 1),
(148, 'Nhà xuất bản Hà Nội', 'vanthu_sovhtt@hanoi.gov.vn', '024 3825 291', '4 P. Tống Duy Tân, Hàng Bông, Hoàn Kiếm, Hà Nội', 1),
(149, 'Nhà xuất bản Tổng hợp thành phố Hồ Chí Minh', 'nxbthtphcm@gmail.com', '028 3822 534', '62 Nguyễn Thị Minh Khai, Đa Kao, Quận 1, Thành phố Hồ Chí Minh', 1),
(150, 'Nhà xuất bản Trẻ', 'hopthubandoc@nxbtre.com.vn', '039317849', '161B Lý Chính Thắng, Phường 7, Quận 3, Thành phố Hồ Chí Minh', 1),
(151, 'Nhà xuất bản Phương Đông', 'nxbphuongdong@gmail.com', '0290 3831 30', '107 Bùi Thị Trường, Phường 5, Thành phố Cà Mau, Cà Mau', 1);

-- --------------------------------------------------------

--
-- Table structure for table `phieu_giam_gia`
--

CREATE TABLE `phieu_giam_gia` (
  `pgg_id` int(11) NOT NULL,
  `pgg_ten` varchar(100) NOT NULL,
  `pgg_giatoithieu` float NOT NULL,
  `pgg_sotiengiam` float NOT NULL,
  `pgg_soluong` int(11) NOT NULL,
  `pgg_ngaybatdau` date NOT NULL,
  `pgg_ngayketthuc` date NOT NULL,
  `sp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `phieu_nhap`
--

CREATE TABLE `phieu_nhap` (
  `pn_id` int(11) NOT NULL,
  `pn_ngaylapphieu` timestamp NULL DEFAULT current_timestamp(),
  `pn_tongtien` float NOT NULL,
  `pn_idncc` int(11) NOT NULL,
  `pn_idnv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `phieu_nhap`
--

INSERT INTO `phieu_nhap` (`pn_id`, `pn_ngaylapphieu`, `pn_tongtien`, `pn_idncc`, `pn_idnv`) VALUES
(1, '2022-10-04 09:19:58', 387000, 1, 111),
(2, '2022-10-04 09:25:09', 27900000, 2, 111);

-- --------------------------------------------------------

--
-- Table structure for table `quyen`
--

CREATE TABLE `quyen` (
  `q_id` int(11) NOT NULL,
  `q_ten` varchar(250) NOT NULL,
  `q_vaitro` varchar(250) DEFAULT NULL,
  `q_mota` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `quyen`
--

INSERT INTO `quyen` (`q_id`, `q_ten`, `q_vaitro`, `q_mota`, `active`) VALUES
(1, 'USER', 'Người dùng', '', 1),
(2, 'ADMIN', 'Người quản lý', NULL, 1),
(3, 'EMPLOYEE', 'Nhân viên', NULL, 1),
(4, 'SHIPPER', 'Người giao hàng', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `san_pham`
--

CREATE TABLE `san_pham` (
  `sp_id` int(11) NOT NULL,
  `sp_masp` varchar(255) NOT NULL,
  `sp_ten` varchar(150) NOT NULL,
  `sp_mota` longtext DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `sp_chieudai` int(11) DEFAULT NULL,
  `sp_chieurong` int(11) DEFAULT NULL,
  `sp_idtl` int(11) NOT NULL,
  `sp_idnn` int(11) NOT NULL,
  `sp_idnxb` int(11) NOT NULL,
  `sp_idtg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `san_pham`
--

INSERT INTO `san_pham` (`sp_id`, `sp_masp`, `sp_ten`, `sp_mota`, `active`, `sp_chieudai`, `sp_chieurong`, `sp_idtl`, `sp_idnn`, `sp_idnxb`, `sp_idtg`) VALUES
(17, '8935235226272', 'Nhà Giả Kim (Tái Bản 2020)', '<p class=\"ql-align-justify\"><em>Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người</em>.&nbsp;</p><p class=\"ql-align-justify\">Tiểu thuyết&nbsp;<em>Nhà giả kim&nbsp;</em>của Paulo Coelho như một câu chuyện cổ tích giản dị, nhân ái, giàu chất thơ, thấm đẫm những minh triết huyền bí của phương Đông. Trong lần xuất bản đầu tiên tại Brazil vào năm 1988, sách chỉ bán được 900 bản. Nhưng, với số phận đặc biệt của cuốn sách dành cho toàn nhân loại, vượt ra ngoài biên giới quốc gia,&nbsp;<em>Nhà giả kim&nbsp;</em>đã làm rung động hàng triệu tâm hồn, trở thành một trong những cuốn sách bán chạy nhất mọi thời đại, và có thể làm thay đổi cuộc đời người đọc.</p><p class=\"ql-align-justify\">“Nhưng nhà luyện kim đan không quan tâm mấy đến những điều ấy. Ông đã từng thấy nhiều người đến rồi đi, trong khi ốc đảo và sa mạc vẫn là ốc đảo và sa mạc. Ông đã thấy vua chúa và kẻ ăn xin đi qua biển cát này, cái biển cát thường xuyên thay hình đổi dạng vì gió thổi nhưng vẫn mãi mãi là biển cát mà ông đã biết từ thuở nhỏ. Tuy vậy, tự đáy lòng mình, ông không thể không cảm thấy vui trước hạnh phúc của mỗi người lữ khách, sau bao ngày chỉ có cát vàng với trời xanh nay được thấy chà là xanh tươi hiện ra trước mắt. ‘Có thể Thượng đế tạo ra sa mạc chỉ để cho con người biết quý trọng cây chà là,’ ông nghĩ.”</p><p class=\"ql-align-justify\">- Trích&nbsp;<em>Nhà giả kim</em></p><p class=\"ql-align-justify\"><strong>Nhận định</strong></p><p class=\"ql-align-justify\">“Sau Garcia Márquez, đây là nhà văn Mỹ Latinh được đọc nhiều nhất thế giới.”&nbsp;<em>- The Economist</em>, London, Anh</p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\">“Santiago có khả năng cảm nhận bằng trái tim như&nbsp;<em>Hoàng tử bé</em>&nbsp;của Saint-Exupéry.”&nbsp;<em>- Frankfurter Allgemeine Zeitung, Đức</em></p>', 1, 21, 13, 5, 4, 6, 22),
(18, '8934974175995', 'Ra Bờ Suối Ngắm Hoa Kèn Hồng', '<p class=\"ql-align-justify\">Ra Bờ Suối Ngắm Hoa Kèn Hồng</p><p class=\"ql-align-justify\"><strong>Ra bờ suối ngắm hoa kèn hồng</strong>&nbsp;là tác phẩm trong trẻo, tràn đầy tình yêu thương mát lành, trải ra trước mắt người đọc khu vườn trại rực rỡ cỏ hoa của vùng quê thanh bình, kèm theo đó là những “nhân vật” đáng yêu, làm nên một “thế giới giàu có, rộng lớn và vô cùng hấp dẫn” mà dường như người lớn đã bỏ quên đâu đó từ lâu.</p><p class=\"ql-align-justify\">Sau&nbsp;<em>Tôi là Bê Tô, Có hai con mèo ngồi bên cửa sổ, Con chó nhỏ mang giỏ hoa hồng,&nbsp;</em>đây là một cuốn sách nữa của nhà văn Nguyễn Nhật Ánh mà nhân vật chính là những bé động vật ngộ nghĩnh, được mô tả sống động dưới ngòi bút tài hoa và giàu tình thương.</p><p class=\"ql-align-justify\">Câu chuyện chạy qua 8 phần với 64 chương sách nhỏ đầy ắp lòng thương yêu, tính lương thiện, tình thân bạn bè, lòng dũng cảm và bao dung, đánh bạt sự ác độc và cả mọi thói xấu.</p><p class=\"ql-align-justify\">Khép cuốn sách lại, tự nhiên thấy lòng mình dịu lắng, bình yên đến lạ lùng…</p><p class=\"ql-align-justify\"><strong><em>Vài đoạn trích&nbsp;trong tác phẩm&nbsp;</em>Ra bờ suối ngắm hoa kèn hồng</strong></p><p class=\"ql-align-justify\"><em>“Tắm mình trong suối âm thanh, vẫn là những điệu buồn quen thuộc, nhưng đêm nay Mắt Tròn thấy tâm hồn mình như bay lên. Âm nhạc như một bàn tay vô hình đã nâng đỡ nó, lên cao, lên cao mãi. Cao hơn nỗi buồn, cao hơn những phiền muộn vẫn dày vò nó trong những ngày qua.</em></p><p class=\"ql-align-justify\"><em>Nỗi buồn, ờ thì nó vẫn ở đó, trong trái tim Mắt Tròn, nhưng nó không làm trái tim con gà xây xát nữa. Mắt Tròn ngạc nhiên nhận ra nỗi buồn có thể phát sáng, trở nên đẹp đẽ dưới sự vỗ về của âm nhạc.</em></p><p class=\"ql-align-justify\"><em>Tiếng đàn của chàng nhạc sĩ giang hồ đã sưởi ấm con gà, đã an ủi nó thật nhiều trong đêm hôm đó.</em></p><p class=\"ql-align-justify\"><em>Mắt Tròn neo mình trên cỏ, bất động, lặng thinh, đầy xao xuyến. Nó lắng nghe tiếng đàn, cảm tưởng đang lắng nghe chính bản thân nó, bắt gặp mình đang xúc động.</em></p><p class=\"ql-align-justify\"><em>Có lẽ bạn cũng thế thôi, khi nỗi buồn trong lòng bạn được âm nhạc chắp cánh, nó sẽ thăng hoa. Thay vì nhấn chìm bạn, nỗi buồn sẽ giúp bạn giàu có hơn về cảm xúc. Nó trở thành một giá trị và bạn chợt nhận ra nó là một phần thanh xuân của bạn.</em></p><p class=\"ql-align-justify\"><em>.............................................</em></p><p class=\"ql-align-justify\"><em>Có gì đâu! Đâu có gì đâu!</em></p><p class=\"ql-align-justify\"><em>Thời gian như nước chảy qua cầu</em></p><p class=\"ql-align-justify\"><em>Bờ cỏ không còn in dấu cũ</em></p><p class=\"ql-align-justify\"><em>Vườn địa đàng kia táo đã sâu.</em></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><em>Có gì không? Không có gì đâu!</em></p><p class=\"ql-align-justify\"><em>Tem chưa đóng dấu đã phai màu</em></p><p class=\"ql-align-justify\"><em>Đường đi không tới đành quay lại</em></p><p class=\"ql-align-justify\"><em>Cuộc sống chưa xong lại bắt đầu</em></p><p class=\"ql-align-justify\"><em>............................................</em></p><p class=\"ql-align-justify\"><em>Mắt Tròn đưa mắt nhìn quanh. Ở đằng xa kia, chỗ nhà giam, cây lộc vừng đang buông lững lờ những chuỗi hoa màu gạch cua, chốc chốc lại chao đi trong gió hệt như một tấm rèm ai treo trên nhánh lá. Trên bãi cỏ xanh bên dưới, thiên nhiên đã đính rải rác những chùm hoa ích mẫu, những cụm hoa mắc cỡ đan cài với cơ man là hoa xuyến chi và hoa sao nhái dệt nên một tấm thảm chi chít các hoa văn ngũ sắc.</em></p><p class=\"ql-align-justify\"><em>Cánh Cam nói đúng, “trong vườn thiếu gì hoa”. Và Mắt Tròn công nhận tất cả loài hoa trong vườn đều đẹp.</em></p><p class=\"ql-align-justify\"><em>Nhưng nó cũng thấy một điều khác đáng công nhận không kém: Chỉ có hoa kèn hồng kia bên dòng suối kia ngoài cánh đồng kia mới có thể đánh thức giấc mơ của nó, khiến trái tim nó tưng bừng reo ca như có chim về hót.”</em></p>', 1, 20, 13, 5, 4, 27, 20),
(19, '8935235228351', 'Cây Cam Ngọt Của Tôi', '<p class=\"ql-align-justify\">“Vị chua chát của cái nghèo hòa trộn với vị ngọt ngào khi khám phá ra những điều khiến cuộc đời này đáng sống... một tác phẩm kinh điển của Brazil.”&nbsp;<strong>- Booklist</strong></p><p class=\"ql-align-justify\">“Một cách nhìn cuộc sống gần như hoàn chỉnh từ con mắt trẻ thơ… có sức mạnh sưởi ấm và làm tan nát cõi lòng, dù người đọc ở lứa tuổi nào.”<strong>&nbsp;- The National</strong></p><p class=\"ql-align-justify\">Hãy làm quen với Zezé, cậu bé tinh nghịch siêu hạng đồng thời cũng đáng yêu bậc nhất, với ước mơ lớn lên trở thành nhà thơ cổ thắt nơ bướm. Chẳng phải ai cũng công nhận khoản “đáng yêu” kia đâu nhé. Bởi vì, ở cái xóm ngoại ô nghèo ấy, nỗi khắc khổ bủa vây đã che mờ mắt người ta trước trái tim thiện lương cùng trí tưởng tượng tuyệt vời của cậu bé con năm tuổi.</p><p class=\"ql-align-justify\">Có hề gì đâu bao nhiêu là hắt hủi, đánh mắng, vì Zezé đã có một người bạn đặc biệt để trút nỗi lòng: cây cam ngọt nơi vườn sau. Và cả một người bạn nữa, bằng xương bằng thịt, một ngày kia xuất hiện, cho cậu bé nhạy cảm khôn sớm biết thế nào là trìu mến, thế nào là nỗi đau, và mãi mãi thay đổi cuộc đời cậu.</p><p class=\"ql-align-justify\">Mở đầu bằng những thanh âm trong sáng và kết thúc lắng lại trong những nốt trầm hoài niệm, Cây cam ngọt của tôi khiến ta nhận ra vẻ đẹp thực sự của cuộc sống đến từ những điều giản dị như bông hoa trắng của cái cây sau nhà, và rằng cuộc đời thật khốn khổ nếu thiếu đi lòng yêu thương và niềm trắc ẩn. Cuốn sách kinh điển này bởi thế không ngừng khiến trái tim người đọc khắp thế giới thổn thức, kể từ khi ra mắt lần đầu năm 1968 tại Brazil.</p><p class=\"ql-align-justify\"><strong>TÁC GIẢ:</strong></p><p class=\"ql-align-justify\">JOSÉ MAURO DE VASCONCELOS (1920-1984) là nhà văn người Brazil. Sinh ra trong một gia đình nghèo ở ngoại ô Rio de Janeiro, lớn lên ông phải làm đủ nghề để kiếm sống. Nhưng với tài kể chuyện thiên bẩm, trí nhớ phi thường, trí tưởng tượng tuyệt vời cùng vốn sống phong phú, José cảm thấy trong mình thôi thúc phải trở thành nhà văn nên đã bắt đầu sáng tác năm 22 tuổi. Tác phẩm nổi tiếng nhất của ông là tiểu thuyết mang màu sắc tự truyện Cây cam ngọt của tôi. Cuốn sách được đưa vào chương trình tiểu học của Brazil, được bán bản quyền cho hai mươi quốc gia và chuyển thể thành phim điện ảnh. Ngoài ra, José còn rất thành công trong vai trò diễn viên điện ảnh và biên kịch.</p>', 1, 20, 15, 5, 4, 6, 6),
(20, '8935235212541', 'Người Bàn Bà Trên Cầu Thang', '<p class=\"ql-align-justify\">“Hòa trộn tuyệt vời văn chương hư cấu với các vấn đề của thời đại. Một tiểu thuyết gay cấn, thông minh, và đầy suy tư.” – Jens Frederiksen,&nbsp;<em>Rhein-Main-Press</em></p><p class=\"ql-align-justify\">Trong một phòng tranh ở Sydney, người đàn ông tình cờ bắt gặp bức tranh vẽ cô gái đã từng khiến ông sẵn sàng vứt bỏ hết thảy để rồi ngoạn mục biến khỏi đời ông. Sau đó, như từ bóng tối bước ra sân khấu, những nhân vật chính mắc kẹt trong cuộc tình tay bốn năm xưa đều xuất hiện. Họa sĩ nổi tiếng thế giới, nhà tài phiệt, và luật sư tái ngộ cùng cô gái trong tranh trên một bờ vịnh Úc, mong muốn giành lại thứ họ nghĩ phải thuộc về mình. Nhưng chuyện đời không đơn giản -&nbsp;đối với một tác phẩm nghệ thuật mà mọi bảo tàng thế giới đều săn lùng, cũng như đối với Irene mà cuộc đời có nhiều góc khuất, khi tuổi tác của tất cả họ đều đã về chiều, và định mệnh thì thường khắc nghiệt...</p><p class=\"ql-align-justify\">Với biệt tài mổ xẻ những ẩn ức tăm tối trong lòng người, Bernhard Schlink đã viết nên một tiểu thuyết về tình yêu thật cuốn hút, mê hoặc.&nbsp;<em>Người đàn bà trên cầu thang&nbsp;</em>cũng đồng thời khắc họa đậm nét hơn chân dung ông trong vai trò một nhà văn luôn nỗ lực khắc phục quá khứ đen tối của nước Đức, để khi lật đến hết trang cuối cùng, tâm trí độc giả sẽ mãi còn trầm tư sâu sắc về những cuộc đời người giữa biển lớn lịch sử.</p>', 1, 21, 14, 5, 4, 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tac_gia`
--

CREATE TABLE `tac_gia` (
  `tg_id` int(11) NOT NULL,
  `tg_ten` varchar(250) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tac_gia`
--

INSERT INTO `tac_gia` (`tg_id`, `tg_ten`, `active`) VALUES
(1, 'Nguyễn Vĩnh Nguyên', 1),
(2, 'Nguyễn Trương Quý', 1),
(3, 'Đỗ Bích Thúy', 1),
(4, 'Nguyễn Mai Chi', 1),
(5, 'Hong Seok Kyeong', 1),
(6, 'Kim Young Dae', 1),
(7, 'Kim Jinwoo', 1),
(8, 'Nguyễn Xuân Lâm', 1),
(9, 'Kang Se Hyoung', 1),
(10, 'Yến Phạm', 1),
(11, 'Chu Đình Tới', 1),
(12, 'Yun Kyo Hoon', 1),
(13, 'Kim Wook', 1),
(14, 'Han Sung Hee', 1),
(15, 'Lý Ái Linh', 1),
(16, 'Mộ Dung Y Tố', 1),
(17, 'Vu Quyên', 1),
(18, 'Hae Min', 1),
(19, 'Nguyên Nguyên', 1),
(20, 'Nguyễn Nhật Ánh', 1),
(21, 'Paulo Coelho', 1),
(22, 'Trác Nhã', 1),
(23, 'Nguyễn Một', 1),
(24, '遠藤 達哉', 1),
(25, '春場 ねぎ', 1),
(26, 'Affetto Amoroso', 1),
(27, 'Negi Haruba', 1),
(28, 'Yoshichi Shimada', 1),
(29, 'Saburo Is', 1),
(30, 'Tomohito Oda\r\n', 1),
(31, 'Umi Sakurai\r\n', 1),
(32, 'Masashi Kishimoto', 1),
(33, 'Gengoroh Tagame', 1),
(34, 'A Crazy Mind', 1),
(35, 'Khotudien', 1),
(36, 'Ở Đây Zui Nè', 1),
(37, 'An', 1),
(38, 'Jenny Kiều', 1),
(39, 'Kulzsc', 1),
(40, 'Nhiều Tác Giả', 1),
(41, 'Haruki Murakami', 1);

-- --------------------------------------------------------

--
-- Table structure for table `the_loai`
--

CREATE TABLE `the_loai` (
  `tl_id` int(11) NOT NULL,
  `tl_ten` varchar(150) NOT NULL,
  `tl_iddm` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `the_loai`
--

INSERT INTO `the_loai` (`tl_id`, `tl_ten`, `tl_iddm`, `active`) VALUES
(1, 'Tiểu Thuyết', 1, 1),
(2, 'Truyện Ngắn - Tản Văn', 1, 1),
(3, 'Light Novel', 1, 1),
(4, 'Ngôn Tình', 1, 1),
(5, 'Truyện Trinh Thám - Kiếm Hiệp', 1, 1),
(6, 'Huyền Bí - Giả Tưởng - Kinh Dị', 1, 1),
(7, 'Tác Phẩm Kinh Điển', 1, 1),
(8, 'Phóng Sự - Ký Sự - Phê Bình Văn Học', 1, 1),
(9, 'Hài Hước - Truyện Cười', 1, 1),
(10, 'Du Ký', 1, 1),
(11, 'Truyện Tranh', 1, 1),
(12, '12 Cung Hoàng Đạo', 1, 1),
(13, 'Thơ Ca, Tục Ngữ, Ca Dao, Thành Ngữ', 1, 1),
(14, 'Chính Trị', 4, 1),
(15, 'Kinh Tế', 4, 1),
(16, 'Thể Thao', 4, 1),
(17, 'Kỹ Năng Sống', 5, 1),
(18, 'Tâm Lý', 5, 1),
(19, 'Lịch Sử', 4, 1),
(20, 'Quản Trị - Lãnh Đạo', 2, 1),
(21, 'Nhân Vật - Bài Học Kinh Doanh', 2, 1),
(22, 'Marketing - Bán Hàng', 2, 1),
(23, 'Khởi Nghiệp - Làm Giàu', 2, 1),
(24, 'Phân Tích Kinh Tế', 2, 1),
(25, 'Tài Chính - Ngân Hàng', 2, 1),
(26, 'Chứng Khoán - Bất Động Sản - Đầu T', 2, 1),
(27, 'Kế Toán - Kiểm Toán - Thuế', 2, 1),
(28, 'Nhân Sự - Việc Làm', 2, 1),
(29, 'Ngoại Thương', 2, 1),
(30, 'Truyện Thiếu Nhi', 3, 1),
(31, 'Kiến Thức - Kỹ Năng Sống Cho Trẻ', 3, 1),
(32, 'Kiến Thức Bách Khoa', 3, 1),
(33, 'Tô Màu, Luyện Chữ', 3, 1),
(34, 'Từ Điển Thiếu Nhi', 3, 1),
(35, 'Flashcard - Thẻ Học Thông Minh', 3, 1),
(36, 'Sách Nói', 3, 1),
(37, 'Tạp Chí Thiếu Nhi', 3, 1),
(38, 'Câu Chuyện Cuộc Đời', 4, 1),
(39, 'Nghệ Thuật - Giải Trí', 4, 1),
(40, 'Sách Cho Tuổi Mới Lớn', 5, 1),
(41, 'Rèn Luyện Nhân Cách', 5, 1),
(42, 'Chicken Soup - Hạt Giống Tâm Hồn', 5, 1),
(43, 'Cẩm Nang Làm Cha Mẹ', 6, 1),
(44, 'Phát Triển Kỹ Năng - Trí Tuệ Cho Trẻ', 6, 1),
(45, 'Phương Pháp Giáo Dục Trẻ Các Nước', 6, 1),
(46, 'Dinh Dưỡng - Sức Khỏe Cho Trẻ', 6, 1),
(47, 'Giáo Dục Trẻ Tuổi Teen', 6, 1),
(48, 'Dành Cho Mẹ Bầu', 6, 1),
(49, 'Sách Tham Khảo', 7, 1),
(50, 'Mẫu Giáo', 7, 1),
(51, 'Sách Giáo Khoa', 7, 1),
(52, 'Sách Giáo Viên', 7, 1),
(53, 'Đại Học', 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trang_thai`
--

CREATE TABLE `trang_thai` (
  `tt_id` int(11) NOT NULL,
  `tt_ngaycapnhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tt_trangthai` int(11) NOT NULL,
  `tt_thongtin` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `credential` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 1,
  `verify` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `email`, `fullname`, `credential`, `phone`, `gender`, `birthday`, `role_id`, `verify`, `active`) VALUES
(111, '114872046152355360109', 'nvnhan.dev@gmail.com', 'Nguyễn Văn Nhẫn', NULL, '0794351150', 'male', '2000-01-01', 2, 1, 1),
(115, NULL, 'nvnhan.dev3@gmail.com', 'Nguyễn Văn Nhẫn A', '$2a$08$pDdIGVk23.bL3wt2SQ6CFebNZdhjBU7p1MT/bDYrhzacfWGoGPtIu', '0794351159', 'male', '2000-01-10', 1, 1, 1),
(117, NULL, 'nvnhan.dev5@gmail.com', 'nguyen van b', '$2a$08$3yCugmqCW0Qx7qW.GLEjY.UN.RsTMsv.H06gkyzmgjeA8hNAaYbL.', '0794351150', 'male', '2000-01-10', 1, 1, 1),
(118, NULL, 'nvnhan.dev6@gmail.com', 'Nguyen van c', '$2a$08$YyRr.7Ia4kThVphmra.a2Oj1W.w8WJITB4Q1ye0mEX5Rz06unvcOu', '', 'male', '2000-01-10', 1, 1, 1),
(119, NULL, 'nvnhan.dev7@gmail.com', 'nguyen van D', '$2a$08$L7/bmih9H43h9mSLGkA8NOCN3m.WyLoAnoPDF.vN8ZTBYtRhhFabK', '0794351150', 'male', '2000-01-10', 3, 1, 1),
(121, NULL, 'linhb1809253@student.ctu.edu.vn', 'Bùi Thị Diệu Linh', '$2a$08$NXYEBvERtlspBfqrQaqcGuiL4B597KEq2UB3hvMejx82nFzXRI2oa', '0794351156', 'female', '2000-01-10', 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `van_chuyen`
--

CREATE TABLE `van_chuyen` (
  `vc_id` int(11) NOT NULL,
  `vc_ngaylayhang` datetime NOT NULL,
  `vc_ngaygiao` datetime NOT NULL,
  `vc_ngaynhan` datetime NOT NULL,
  `ngh_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `binh_luan`
--
ALTER TABLE `binh_luan`
  ADD PRIMARY KEY (`bl_id`);

--
-- Indexes for table `chi_tiet_hoa_don`
--
ALTER TABLE `chi_tiet_hoa_don`
  ADD PRIMARY KEY (`cthd_id`);

--
-- Indexes for table `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD PRIMARY KEY (`ctpn_id`);

--
-- Indexes for table `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`dm_id`);

--
-- Indexes for table `dia_chi`
--
ALTER TABLE `dia_chi`
  ADD PRIMARY KEY (`dc_id`);

--
-- Indexes for table `hinh_anh`
--
ALTER TABLE `hinh_anh`
  ADD PRIMARY KEY (`ha_id`);

--
-- Indexes for table `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD PRIMARY KEY (`hd_id`);

--
-- Indexes for table `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD PRIMARY KEY (`kh_id`);

--
-- Indexes for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  ADD PRIMARY KEY (`km_id`);

--
-- Indexes for table `ngon_ngu`
--
ALTER TABLE `ngon_ngu`
  ADD PRIMARY KEY (`nn_id`);

--
-- Indexes for table `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD PRIMARY KEY (`nv_id`);

--
-- Indexes for table `nha_cung_cap`
--
ALTER TABLE `nha_cung_cap`
  ADD PRIMARY KEY (`ncc_id`);

--
-- Indexes for table `nha_xuat_ban`
--
ALTER TABLE `nha_xuat_ban`
  ADD PRIMARY KEY (`nxb_id`);

--
-- Indexes for table `phieu_giam_gia`
--
ALTER TABLE `phieu_giam_gia`
  ADD PRIMARY KEY (`pgg_id`);

--
-- Indexes for table `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD PRIMARY KEY (`pn_id`);

--
-- Indexes for table `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`q_id`);

--
-- Indexes for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`sp_id`);

--
-- Indexes for table `tac_gia`
--
ALTER TABLE `tac_gia`
  ADD PRIMARY KEY (`tg_id`);

--
-- Indexes for table `the_loai`
--
ALTER TABLE `the_loai`
  ADD PRIMARY KEY (`tl_id`);

--
-- Indexes for table `trang_thai`
--
ALTER TABLE `trang_thai`
  ADD PRIMARY KEY (`tt_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `van_chuyen`
--
ALTER TABLE `van_chuyen`
  ADD PRIMARY KEY (`vc_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `binh_luan`
--
ALTER TABLE `binh_luan`
  MODIFY `bl_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chi_tiet_hoa_don`
--
ALTER TABLE `chi_tiet_hoa_don`
  MODIFY `cthd_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  MODIFY `ctpn_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `dm_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `dia_chi`
--
ALTER TABLE `dia_chi`
  MODIFY `dc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hinh_anh`
--
ALTER TABLE `hinh_anh`
  MODIFY `ha_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `hoa_don`
--
ALTER TABLE `hoa_don`
  MODIFY `hd_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khach_hang`
--
ALTER TABLE `khach_hang`
  MODIFY `kh_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  MODIFY `km_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ngon_ngu`
--
ALTER TABLE `ngon_ngu`
  MODIFY `nn_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `nhan_vien`
--
ALTER TABLE `nhan_vien`
  MODIFY `nv_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nha_cung_cap`
--
ALTER TABLE `nha_cung_cap`
  MODIFY `ncc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `nha_xuat_ban`
--
ALTER TABLE `nha_xuat_ban`
  MODIFY `nxb_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `phieu_giam_gia`
--
ALTER TABLE `phieu_giam_gia`
  MODIFY `pgg_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  MODIFY `pn_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `quyen`
--
ALTER TABLE `quyen`
  MODIFY `q_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `sp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tac_gia`
--
ALTER TABLE `tac_gia`
  MODIFY `tg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `the_loai`
--
ALTER TABLE `the_loai`
  MODIFY `tl_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `trang_thai`
--
ALTER TABLE `trang_thai`
  MODIFY `tt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `van_chuyen`
--
ALTER TABLE `van_chuyen`
  MODIFY `vc_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
