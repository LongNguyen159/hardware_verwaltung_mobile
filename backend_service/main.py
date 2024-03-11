import subprocess
import sys

# install packages
subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

import mysql.connector


class DatabaseManager:

    def __init__(self, database_name: str = "logistics_system"):
        self.sql_connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="",
            database=""
        )
        # always deleting the database and creating it new (for testing)
        #self.create_database(database_name)
        self.database_connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="",
            database=database_name
        )
        self.db_cursor = self.database_connection.cursor()

    def create_database(self, database_name: str):
        self.sql_connection.cursor().execute(f"""DROP DATABASE IF EXISTS {database_name};""")
        self.sql_connection.cursor().execute(f"""CREATE DATABASE IF NOT EXISTS {database_name};""")
        self.sql_connection.cursor().execute(f"""USE {database_name};""")
        print("created database")

    def execute_sql(self, statement):
        print(statement)
        self.db_cursor.execute(f"""{statement}""")
        # result = self.db_cursor.fetchall()
        # for item in result:
        #     item = [str(x) for x in item]
        #     ", ".join(item)
        #     print("\n")
        # return result

    def execute_sql_commit(self, statement):
        self.db_cursor.execute(f"""{statement}""")
        self.database_connection.commit()

    def select(self, statement: str = "*"):
        print()
        print(statement)
        self.db_cursor.execute(f"""{statement}""")
        result = self.db_cursor.fetchall()
        for item in result:
            print("\t" + str(item))
        return result

    def create_tables(self):
        self.execute_sql("""
            CREATE TABLE ProductType (
                ProductID           INTEGER NOT NULL AUTO_INCREMENT,
                Name                VARCHAR(50),
                Description         VARCHAR(512),
                PRIMARY KEY (ProductID)
            );
        """)

        self.execute_sql("""
            CREATE TABLE UserType (
                UserTypeID          INTEGER NOT NULL AUTO_INCREMENT,
                Name                VARCHAR(50),
                PRIMARY KEY (UserTypeID)
            );
        """)

        self.execute_sql("""
            CREATE TABLE Room (
                RoomID              INTEGER NOT NULL AUTO_INCREMENT,
                RoomNumber          VARCHAR(50),
                PRIMARY KEY (RoomID)
            );
        """)

        self.execute_sql("""
            CREATE TABLE ItemHistoryType (
                ItemHistoryTypeID   INTEGER NOT NULL AUTO_INCREMENT,
                Name                VARCHAR(50),
                PRIMARY KEY (ItemHistoryTypeID)
            );
        """)

        self.execute_sql("""
            CREATE TABLE User (
                UserID              INTEGER NOT NULL AUTO_INCREMENT,
                FirstName           VARCHAR(100),
                LastName            VARCHAR(100),
                Email               VARCHAR(100),
                UserTypeID          INTEGER NOT NULL,
                PasswordHash        VARCHAR(255),
                PRIMARY KEY (UserID),
                FOREIGN KEY (UserTypeID) REFERENCES UserType (UserTypeID)
            );
        """)

        # maybe add the other foreign keys
        self.execute_sql("""
            CREATE TABLE Item (
                ItemID              INTEGER NOT NULL AUTO_INCREMENT,
                ProductID           INTEGER NOT NULL,
                CurrentRoomID       INTEGER,
                BorrowedByUserID    INTEGER,
                Annotation          VARCHAR(512),
                QrCode              VARCHAR(512),
                PRIMARY KEY (ItemID),
                FOREIGN KEY (CurrentRoomID) REFERENCES Room (RoomID),
                FOREIGN KEY (BorrowedByUserID) REFERENCES User (UserID),
                FOREIGN KEY (ProductID) REFERENCES ProductType (ProductID)
            );
        """)

        self.execute_sql("""
            CREATE TABLE ItemHistory (
                HistoryID           INTEGER NOT NULL AUTO_INCREMENT,
                ItemID              INTEGER NOT NULL,
                UserID              INTEGER,
                ItemHistoryTypeID   INTEGER,
                Date                DATETIME,
                RoomID              INTEGER,
                PRIMARY KEY (HistoryID),
                FOREIGN KEY (ItemID) REFERENCES Item (ItemID),
                FOREIGN KEY (UserID) REFERENCES User (UserID),
                FOREIGN KEY (ItemHistoryTypeID) REFERENCES ItemHistoryType (ItemHistoryTypeID),
                FOREIGN KEY (RoomID) REFERENCES Room (RoomID)
            );
        """)

    def insert_test_data(self):
        data = [
            "INSERT INTO `itemhistorytype` (`id`, `Name`) VALUES (1, 'Ausleihe')",
            "INSERT INTO `itemhistorytype` (`id`, `Name`) VALUES (2, 'Rückgabe')",
            "INSERT INTO `room` (`id`, `room_number`) VALUES (1, 'Raum 101')",
            "INSERT INTO `room` (`id`, `room_number`) VALUES (2, 'Raum 102')",
            "INSERT INTO `room` (`id`, `room_number`) VALUES (3, 'Raum 201')",
            "INSERT INTO `usertype` (`id`, `Name`) VALUES (1, 'Admin')",
            "INSERT INTO `usertype` (`id`, `Name`) VALUES (2, 'EndUser')",
            "INSERT INTO `usertype` (`id`, `Name`) VALUES (3, 'Teacher')",
            "INSERT INTO `producttype` (`id`, `Name`, `Description`) VALUES (1, 'HDMI Kabel', 'HDMI Kabel 3m Länge und so')",
            "INSERT INTO `producttype` (`id`, `Name`, `Description`) VALUES (2, 'Raspberry', 'Raspberry Pi 4, 4GB Ram mit Case')",
            "INSERT INTO `user` (`id`, `First_Name`, `Last_Name`, `Email`, `User_Type_ID`, `Password_Hash`) VALUES (1, 'Karl', 'Dieter', 'karl.dieter@deinemum.com', '2', 'sojkfghspoghügbjsoigjs')",
            "INSERT INTO `user` (`id`, `First_Name`, `Last_Name`, `Email`, `User_Type_ID`, `Password_Hash`) VALUES (2, 'Madita', 'Karlson', 'madita.karlson@moin.de', 1, 'dgfdgdfhfshjfnrfthrh,fxh,frxhfhffhxfhfxusrhsgaejme,ehfhf')",
            "INSERT INTO `user` (`id`, `First_Name`, `Last_Name`, `Email`, `User_Type_ID`, `Password_Hash`) VALUES (3, 'Karlos', 'Adminos', 'karlos.adminos@admin.de', 1, 'gfsngjdezkdhf,jgkjghbdrh,fjfshgbhrshkmsrtherbgr')",
            "INSERT INTO `item` (`id`, `Product_type_ID`, `Current_Room_ID`, `Borrowed_By_User_ID`, `Annotation`, `Qr_Code`) VALUES (1, 1, 1, NULL, 'Digga, Kratzer da Oben', 'sfsgsdgfsfs')",
            "INSERT INTO `itemhistory` (`id`, `Item_ID`, `User_ID`, `Item_History_Type_ID`, `Date`, `Room_ID`) VALUES (NULL, '1', '1', '1', '2024-03-07 16:05:57', '1')",
            "INSERT INTO `itemhistory` (`id`, `Item_ID`, `User_ID`, `Item_History_Type_ID`, `Date`, `Room_ID`) VALUES (NULL, '1', '1', '2', '2024-03-07 16:16:30', '3')"
        ]

        for entry in data:
            self.execute_sql_commit(entry)


def main():
    dbm = DatabaseManager()
    #dbm.create_tables()
    dbm.insert_test_data()


if __name__ == '__main__':
    main()
