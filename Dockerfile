FROM codefresh/cf-base-ide:develop

#lifecycle "install" step
  #contributed from service "git"
  RUN sudo apt-get -q -y install git
  RUN sudo apt-get -q -y install imagemagick

  RUN echo verchol_nextplay_88639a30cf22af5679e9562bf1a29aced4f4730c

  # build work dir
  RUN mkdir -p /workdir/verchol
  COPY resources/workdir/.gitignore /workdir/.gitignore
  COPY resources/workdir/.env.json /workdir/.env.json
  COPY resources/workdir/.workspace.json /workdir/verchol/.workspace.json
  COPY resources/workdir/term.sh /workdir/verchol/term.sh
  COPY resources/workdir/autostart.sh /workdir/verchol/autostart.sh

  #contributed from service "ssh-key"
  

  # get repo files
  WORKDIR /workdir/verchol/nextplay
  COPY . /workdir/verchol/nextplay

  # configure git settings
  RUN git config --global core.excludesfile /workdir/.gitignore

  # add project files
  COPY resources/workdir/project.json /workdir/verchol/nextplay/project.json
  RUN mkdir -p /workdir/verchol/nextplay/launchConfigurations
  COPY resources/workdir/run.launch /workdir/verchol/nextplay/launchConfigurations/nextplay.launch
  COPY resources/workdir/autostart.launch /workdir/verchol/nextplay/launchConfigurations/autostart.launch
  WORKDIR /workdir/verchol/nextplay/launchConfigurations
  RUN grep -l "\"JSFile\": \"\"" *.launch | xargs rm -f

  WORKDIR /workdir/verchol/nextplay

  RUN npm install
RUN [ -e bower.json ] && bower install --allow-root --config.interactive=false

  #lifecycle "config" step
  #contributed from service "port"
  EXPOSE 8080

  #contributed from service "port"
  EXPOSE 8081
  EXPOSE 9000

  #additional ports provided by the user
  

  # default environment variables

ADD start.sh /opt/codefresh/
CMD bash /opt/codefresh/start.sh
