-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema studentManage
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema studentManage
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `studentManage` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema zfd
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema student_manage
-- -----------------------------------------------------
USE `studentManage` ;

-- -----------------------------------------------------
-- Table `studentManage`.`student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`student` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `studentID` INT(11) NOT NULL,
  `studentName` VARCHAR(20) NOT NULL,
  `birthday` DATE NOT NULL,
  `major` VARCHAR(45) NOT NULL,
  UNIQUE INDEX `studentID_UNIQUE` (`studentID` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentManage`.`course`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`course` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `courseID` INT(11) NOT NULL,
  `courseName` VARCHAR(45) NOT NULL,
  `credit` INT(11) NOT NULL,
  UNIQUE INDEX `courseID_UNIQUE` (`courseID` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentManage`.`teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`teacher` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `teacherID` INT(11) NOT NULL,
  `teacherName` VARCHAR(20) NOT NULL,
  `jobTitle` VARCHAR(45) NOT NULL,
  UNIQUE INDEX `teacherID_UNIQUE` (`teacherID` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentManage`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` INT(11) NOT NULL,
  `password` VARCHAR(80) NOT NULL,
  `userType` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentManage`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`admin` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentManage`.`chooseCourse`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`chooseCourse` (
  `studentID` INT(11) NOT NULL,
  `courseID` INT(11) NOT NULL,
  `grade` INT(11) NOT NULL,
  PRIMARY KEY (`studentID`, `courseID`),
  INDEX `fk_student_has_course_course1_idx` (`courseID` ASC),
  INDEX `fk_student_has_course_student_idx` (`studentID` ASC),
  CONSTRAINT `fk_student_has_course_student`
    FOREIGN KEY (`studentID`)
    REFERENCES `studentManage`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_student_has_course_course1`
    FOREIGN KEY (`courseID`)
    REFERENCES `studentManage`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studentManage`.`teachCourse`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studentManage`.`teachCourse` (
  `course_id` INT(11) NOT NULL,
  `teacher_id` INT(11) NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`course_id`, `teacher_id`),
  INDEX `fk_course_has_teacher_teacher1_idx` (`teacher_id` ASC),
  INDEX `fk_course_has_teacher_course1_idx` (`course_id` ASC),
  CONSTRAINT `fk_course_has_teacher_course1`
    FOREIGN KEY (`course_id`)
    REFERENCES `studentManage`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_course_has_teacher_teacher1`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `studentManage`.`teacher` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;



####建立触发器
CREATE TRIGGER InsertStudent AFTER INSERT ON student
FOR EACH ROW
BEGIN
INSERT INTO users(username,PASSWORD,userType) VALUES (new.studentID,'e10adc3949ba59abbe56e057f20f883e','student');
END

####添加信息部分

-----------

#####插入用户信息
INSERT INTO `users` (`id`, `username`, `password`, `userType`) VALUES (NULL, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin');

#####插入学生信息
INSERT INTO `student` (`id`, `studentID`, `studentName`, `birthday`, `major`) VALUES ('1', '1407080229', '金朝麟', '1995-12-09', '软件工程');


#####插入教师信息
INSERT INTO `teacher` (`id`, `teacherID`, `teacherName`, `jobTitle`) VALUES ('1', '1001', '李明', '讲师');

#####添加课程
INSERT INTO `course` (`id`, `courseID`, `courseName`, `credit`) VALUES ('1', '0001', 'C语言', '2');

#####学生选课
INSERT INTO `chooseCourse` (`studentID`, `courseID`, `grade`) VALUES ('1', '1', '80');

#####教师开课
INSERT INTO `teachCourse` (`course_id`, `teacher_id`, `date`) VALUES ('1', '1', '2016-06-16');

####查询信息部分

-----------

#####查询学生信息
SELECT * FROM `student` WHERE `studentID` = 1407080229

####查询教师信息
SELECT * FROM `teacher` WHERE `teacherID` = 1001




