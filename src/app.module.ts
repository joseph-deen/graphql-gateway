import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import graphqlModule from './graphql/graphql.module';

@Module({
  imports: [ graphqlModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
