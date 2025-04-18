-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: project-q
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE `project-q`;

USE `project-q`;

--
-- Table structure for table `object-blobs`
--

DROP TABLE IF EXISTS `object-blobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `object-blobs` (
  `object-file-hash-id` varchar(45) NOT NULL,
  `object-hash-id` varchar(45) DEFAULT NULL,
  `object-file-name` varchar(45) DEFAULT NULL,
  `object-file-size` bigint DEFAULT NULL,
  `object-blob` longblob,
  PRIMARY KEY (`object-file-hash-id`),
  UNIQUE KEY `object-file-hash-id_UNIQUE` (`object-file-hash-id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object-blobs`
--

LOCK TABLES `object-blobs` WRITE;
/*!40000 ALTER TABLE `object-blobs` DISABLE KEYS */;

/*!40000 ALTER TABLE `object-blobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects` (
  `object-hash-id` varchar(8) NOT NULL,
  `object-type` varchar(40) NOT NULL,
  `object-post-date` datetime NOT NULL,
  `object-title` varchar(140) NOT NULL,
  `object-creator-user` varchar(45) NOT NULL,
  `object-description` varchar(1000) NOT NULL,
  `object-answer-detail` varchar(45) DEFAULT NULL,
  `object-tags` json DEFAULT NULL,
  `object-download-count` int DEFAULT NULL,
  `object-preview-imgs` json DEFAULT NULL,
  `object-file-name` varchar(45) DEFAULT NULL,
  `object-file-extension` varchar(45) DEFAULT NULL,
  `object-file-hash` varchar(40) DEFAULT NULL,
  `object-file-size` float DEFAULT NULL,
  PRIMARY KEY (`object-hash-id`),
  UNIQUE KEY `object-hash-id_UNIQUE` (`object-hash-id`),
  UNIQUE KEY `object-file-hash_UNIQUE` (`object-file-hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review-id` int NOT NULL AUTO_INCREMENT,
  `object-hash-id` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `review-user` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `review-date` datetime NOT NULL,
  `review-rating` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `review-text` varchar(240) CHARACTER SET utf32 COLLATE utf32_general_ci DEFAULT NULL,
  PRIMARY KEY (`review-id`),
  UNIQUE KEY `review-id_UNIQUE` (`review-id`)
) ENGINE=InnoDB AUTO_INCREMENT=2010 DEFAULT CHARSET=utf32;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stars`
--

DROP TABLE IF EXISTS `stars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stars` (
  `star-id` int NOT NULL,
  `star-user` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `star-on-hash-id` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `star-rating` int DEFAULT NULL,
  PRIMARY KEY (`star-id`),
  UNIQUE KEY `star-id_UNIQUE` (`star-id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stars`
--

LOCK TABLES `stars` WRITE;
/*!40000 ALTER TABLE `stars` DISABLE KEYS */;
/*!40000 ALTER TABLE `stars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag-name` varchar(15) NOT NULL,
  `tag-description` varchar(1000) DEFAULT NULL,
  `tag-created-date` datetime DEFAULT NULL,
  `tag-created-by` varchar(45) DEFAULT NULL,
  `tag-type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tag-name`),
  UNIQUE KEY `tag-name_UNIQUE` (`tag-name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user-name` varchar(45) NOT NULL,
  `user-email` varchar(45) DEFAULT NULL,
  `google-user-id` varchar(45) DEFAULT NULL,
  `user-type` varchar(45) DEFAULT NULL,
  `user-auth-token` varchar(100) DEFAULT NULL,
  `user-auth-token-expiry` datetime DEFAULT NULL,
  `user-dob` datetime DEFAULT NULL,
  PRIMARY KEY (`user-name`),
  UNIQUE KEY `user-name_UNIQUE` (`user-name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `view_count`
--

DROP TABLE IF EXISTS `view_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `view_count` (
  `view-id` int NOT NULL,
  `object-hash-id` varchar(8) DEFAULT NULL,
  `view-datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`view-id`),
  UNIQUE KEY `view-id_UNIQUE` (`view-id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `view_count`
--

LOCK TABLES `view_count` WRITE;
/*!40000 ALTER TABLE `view_count` DISABLE KEYS */;
/*!40000 ALTER TABLE `view_count` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-19 21:24:56

CREATE USER 'read_public'@'localhost' IDENTIFIED BY 'ch@ngeM3!read_public';
GRANT SELECT ON * TO 'read_public'@'localhost';
CREATE USER 'write_public'@'localhost' IDENTIFIED BY 'ch@ngeM3!write_public';
GRANT SELECT, INSERT, UPDATE ON * TO 'write_public'@'localhost';