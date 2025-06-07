-- MySQL dump 10.13  Distrib 9.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: dbSurvey
-- ------------------------------------------------------
-- Server version	9.3.0

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

--
-- Table structure for table `FoodChoice`
--

DROP TABLE IF EXISTS `FoodChoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FoodChoice` (
  `choiceID` int NOT NULL AUTO_INCREMENT,
  `respondentID` int DEFAULT NULL,
  `foodItem` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`choiceID`),
  KEY `respondentID` (`respondentID`),
  CONSTRAINT `FoodChoice_ibfk_1` FOREIGN KEY (`respondentID`) REFERENCES `SurveyRespondent` (`respondentID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FoodChoice`
--

LOCK TABLES `FoodChoice` WRITE;
/*!40000 ALTER TABLE `FoodChoice` DISABLE KEYS */;
INSERT INTO `FoodChoice` VALUES (1,1,'Pizza'),(2,1,'Pasta'),(3,1,'Pap and Wors'),(4,3,'Other'),(5,4,'Pasta'),(6,4,'Pap and Wors'),(7,5,'Pap and Wors'),(8,5,'Other'),(9,6,'Pasta'),(10,6,'Pap and Wors'),(11,8,'Pap and Wors'),(12,8,'Other'),(13,9,'Pap and Wors'),(14,9,'Other'),(15,10,'Pizza');
/*!40000 ALTER TABLE `FoodChoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RatingLikes`
--

DROP TABLE IF EXISTS `RatingLikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RatingLikes` (
  `ratingID` int NOT NULL AUTO_INCREMENT,
  `respondentID` int DEFAULT NULL,
  `hobies` enum('Movies','Radio','Eatout','TV') DEFAULT NULL,
  `likeMeter` int DEFAULT NULL,
  PRIMARY KEY (`ratingID`),
  KEY `respondentID` (`respondentID`),
  CONSTRAINT `RatingLikes_ibfk_1` FOREIGN KEY (`respondentID`) REFERENCES `SurveyRespondent` (`respondentID`),
  CONSTRAINT `RatingLikes_chk_1` CHECK ((`likeMeter` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RatingLikes`
--

LOCK TABLES `RatingLikes` WRITE;
/*!40000 ALTER TABLE `RatingLikes` DISABLE KEYS */;
INSERT INTO `RatingLikes` VALUES (1,1,'Movies',1),(2,1,'Radio',3),(3,1,'Eatout',2),(4,1,'TV',2),(5,2,'Movies',2),(6,2,'Radio',2),(7,2,'Eatout',1),(8,2,'TV',2),(9,3,'Movies',2),(10,3,'Radio',2),(11,3,'Eatout',1),(12,3,'TV',2),(13,4,'Movies',1),(14,4,'Radio',1),(15,4,'Eatout',1),(16,4,'TV',1),(17,5,'Movies',2),(18,5,'Radio',5),(19,5,'Eatout',2),(20,5,'TV',5),(21,6,'Movies',3),(22,6,'Radio',2),(23,6,'Eatout',2),(24,6,'TV',4),(25,7,'Movies',4),(26,7,'Radio',5),(27,7,'Eatout',3),(28,7,'TV',1),(29,8,'Movies',2),(30,8,'Radio',3),(31,8,'Eatout',1),(32,8,'TV',3),(33,9,'Movies',1),(34,9,'Radio',4),(35,9,'Eatout',1),(36,9,'TV',3),(37,10,'Movies',1),(38,10,'Radio',5),(39,10,'Eatout',1),(40,10,'TV',5);
/*!40000 ALTER TABLE `RatingLikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyRespondent`
--

DROP TABLE IF EXISTS `SurveyRespondent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SurveyRespondent` (
  `respondentID` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(101) DEFAULT NULL,
  `email` varchar(101) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `contactNo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`respondentID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyRespondent`
--

LOCK TABLES `SurveyRespondent` WRITE;
/*!40000 ALTER TABLE `SurveyRespondent` DISABLE KEYS */;
INSERT INTO `SurveyRespondent` VALUES (1,'Ike Mohlamonyane','ilkebroll@mailer.com','1993-04-10','0715685127'),(2,'Percy Mokone','percym@mailer.com','1995-10-15','0815625851'),(3,'Pontsho Mokone','percym@mailer.com','1995-10-15','0815655851'),(4,'Madula Mokone','mm@mailer.com','1956-02-04','0859514563'),(5,'Oupa Mokone','oupam@mailer.com','1992-03-27','0815859827'),(6,'Prince Mokone','princem@mailer.com','1992-03-26','0819996663'),(7,'Bohllale Mokone','bahlamokonebn@maile.com','2000-06-01','0659512563'),(8,'Lethabo Matseke','lethabo@mailer.com','1948-05-06','0786199827'),(9,'Lethabo Patrick Matseke','lpm@mailer.com','1928-05-06','0728981122'),(10,'Billy Kim','bk@mailer.com','2005-05-06','0879631254');
/*!40000 ALTER TABLE `SurveyRespondent` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04 14:19:47
