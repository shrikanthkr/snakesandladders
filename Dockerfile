FROM ubuntu:latest
RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install nodejs -y
RUN apt-get install ruby-full -y
RUN gem install bundler -v 2.0.2
RUN apt-get -y install gcc
RUN apt-get install -y build-essential
WORKDIR /app
COPY . /app
RUN npm install
RUN bundle install
EXPOSE 1337
CMD ["npm", "start"]