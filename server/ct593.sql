-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 09, 2022 at 07:29 PM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `credential` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `verify` tinyint(1) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `email`, `fullname`, `credential`, `phone`, `gender`, `birthday`, `verify`, `active`) VALUES
(100, '114872046152355360109', 'nvnhan.dev@gmail.com', 'Nhẫn', '$2a$10$okmL2DBF5k0aGK1DofQnB.2qSG6OpKE8iBtiNu2/lggoxdzfdW/pO', NULL, NULL, NULL, 0, 1),
(103, '114872046152355360109', 'nvnhan.dev@gmail.com', 'Nhẫn', '$2a$10$dYtiqR8l6.a5yQ1V2PzE5uFErCW7CEZgdTlz0Av.unHagjzaLclLG', NULL, NULL, NULL, 0, 1),
(104, '114872046152355360109', 'nvnhan.dev@gmail.com', 'Nhẫn', '$2a$10$6JzivuK8aZgO5NOJcUJVuOPx0Gw9S4RAZKY2IOAe489ucerQigr6q', NULL, NULL, NULL, 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
