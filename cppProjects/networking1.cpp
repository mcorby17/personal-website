#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <iostream>
#include <fstream>
using namespace std;

void error(const char *msg)
{
    perror(msg);
    exit(0);
}

int main(int argc, char *argv[])
{
    int sockfd, portno, n, zip;
    struct sockaddr_in serv_addr;
    struct hostent *server;
    char buffer[4000], holdChar[25];  //Where typed in words are stored
    char mode;                        //Designates which mode the user wants to execute
    bool done = false;                //determines when to break out of the do while loop
	ofstream OutputFile;	          //File to write output to 

    portno = 2628; 					  // Port number of dict.org
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
	
    if (sockfd < 0)
        error("ERROR opening socket");
	
    server = gethostbyname("www.dict.org");
	
    if (server == NULL) {
        fprintf(stderr,"ERROR, no such host\n");
        exit(0);
    }
	
    bzero((char *) &serv_addr, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
	
    bcopy((char *)server->h_addr,
         (char *)&serv_addr.sin_addr.s_addr,
         server->h_length);
    serv_addr.sin_port = htons(portno);
	
    if (connect(sockfd,(struct sockaddr *) &serv_addr,sizeof(serv_addr)) < 0)
        error("ERROR connecting");

    n = write(sockfd,buffer,strlen(buffer));
    if (n < 0)
		error("ERROR writing to socket");

    n = read(sockfd,buffer,4000); //Puts '220' in 'buffer' if the connection was successful
    if (n < 0)
		error("ERROR reading from socket");

    if(buffer[0]!='2')     				  // If the first number isn't '2', the connection was  
        error("ERROR couldn't connect");  // unsuccessful since 220 is returned upon connection
       
	OutputFile.open("output.txt", ofstream::out | ofstream::app);     // This allows data to be written 
		
	if (OutputFile.fail())										  // to the file without overwriting
		error("Couldn't open the file");						  // the last entry
	else
		cout << "Output file opened successfully!\n";

//Begin functionality
	do{
		cout << "What function would you like to use? (d, z, or q): ";
		cin >> mode;

		if(mode == 'd' || mode == 'D'){ // Looks up a word and returns it's definition from dict.org
			bzero(buffer,4000); // Reset 'buffer' to a zero-array
			bzero(holdChar,25); // Reset 'holdChar' to a zero-array
			cout << "Enter a word to lookup: " << endl;
			cin >> holdChar;
				
			// Connect to "WordNet (r) 3.0 (2006)" database by copying and sending the command "DEFINE wn ____"
			sprintf(buffer, "DEFINE wn %s\n", holdChar); //Copies 'holdChar' to buffer
				
			//Sends "DEFINE wn ____", stored in buffer, to the server		
			n = write(sockfd,buffer,strlen(buffer)); 
			if (n < 0)
				error("ERROR writing to socket");
		
			// Print out definition and write to the output file
			do  {
					bzero(buffer,4000);
					n = read(sockfd,buffer,4000);
					cout << buffer;
					OutputFile << buffer << "\n\n";
				} while ((strstr(buffer, "250 ok")== NULL) && (strstr(buffer, "552 no match") == NULL)); // Checks to see if "250 ok" is in the buffer
													   // Only print while we don't reach the "250 ok"
			// Print error if socket read fails					 
			if (n < 0)
				error("ERROR reading from socket");		
		}
		else if(mode == 'z' || mode == 'Z'){ // Asks for a zip code to submit to dict.org
			bzero(buffer,4000); // Reset 'buffer' to a zero-array
			bzero(holdChar,25); // Reset 'holdChar' to a zero-array
			cout << "Enter a 5-digit zip code: ";
			cin >> holdChar;

			// Connect to "U.S. Gazetteer Zip Code Tabulation Areas (4000)" database
			sprintf(buffer, "DEFINE gaz2k-zips %s\n", holdChar);
		
			//Sends "DEFINE gaz2k-zips ____", stored in buffer, to the server
			n = write(sockfd,buffer,strlen(buffer));
			if (n < 0)
				error("ERROR writing to socket");
		
			// Print out zip code information the same way we printed out the definitions
			do  {
					bzero(buffer,4000);
					n = read(sockfd,buffer,4000);
					cout << buffer;
					OutputFile << buffer << "\n\n";
				} while ((strstr(buffer, "250 ok")== NULL) && (strstr(buffer, "552 no match") == NULL));
			
			// Print error if socket read fails
			if (n < 0)
				error("ERROR reading from socket");				
		}
		else if(mode == 'q' || mode == 'Q'){ // Quits the program
			bzero(buffer,4000); // Reset 'buffer' to a zero-array
			bzero(holdChar,25); // Reset 'holdChar' to a zero-array
		
			// Close the socket and check that it's closed. read() will return -1 if the socket closed.
			close(sockfd);
			n = read(sockfd,buffer,4000); 		
			if(n < 0)								
				cout << "Closed the socket" << endl;
			else
				error("Socket was not closed!");
		
			OutputFile.close();
			done = true;
		}
	} while(done != true);

    return 0;
}
