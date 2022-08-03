import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import nodeFetch from 'node-fetch';
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';
import {
  OperationTypeNode,
  buildSchema as buildSchemaGraphql,
  GraphQLSchema,
  printSchema,
} from 'graphql';
import {
  SubscriptionClient,
  ConnectionContext,
} from 'subscriptions-transport-ws';
import { extend } from 'lodash';
import { ApolloDriver } from '@nestjs/apollo';
import {
  wrapSchema,
  RenameTypes,
  RenameRootTypes,
  RenameRootFields,
  RenameObjectFields,
  RenameObjectFieldArguments,
  RenameInterfaceFields,
  RenameInputObjectFields,
} from '@graphql-tools/wrap';

declare const module: any;
interface IDefinitionsParams {
  operation?: OperationTypeNode;
  kind: 'OperationDefinition' | 'FragmentDefinition';
}
interface IContext {
  graphqlContext: {
    subscriptionClient: SubscriptionClient;
  };
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  //private remoteLink: string = 'https://graphql.contentful.com/content/v1/spaces/0uk0rl0l436k/environments/master';
  private remoteAEMLink: string =
    'https://author-p66811-e584549.adobeaemcloud.com/content/_cq_graphql/pierianemeapartnersandboxprogram/endpoint.json';

  async createGqlOptions(): Promise<GqlModuleOptions> {
    // load from endpoint
    //const remoteSchema: GraphQLSchema = await loadSchema(this.remoteLink, {
    const remoteSchema: GraphQLSchema = await loadSchema(this.remoteAEMLink, {
      loaders: [new UrlLoader()],
      headers: {
        Accept: 'application/json',
        //Authorization: 'Bearer 896NDZRFj8dvNG0iI2EjlAvcU8DQnOUdtEnTKJF_yTw'
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE2NTk1MTYzNTk0OTVfZDZhNGU0YzItMDljMS00ZDMyLThkMGUtZGRkOGY4ZjA0Yzk2X3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJkZXYtY29uc29sZS1wcm9kIiwidXNlcl9pZCI6IkE2RjI2RjkyNjJENTY4MkUwQTQ5NUM0MEA2M2RhNDlkYTYyNDc2YmQ2NDk1ZmRkLmUiLCJzdGF0ZSI6InBkalowUldMWUR2bG9PM3drbzMzU0FvYiIsImFzIjoiaW1zLW5hMSIsImFhX2lkIjoiOUNCMTZGOTI2MkQ1MUU4MzBBNDk1QzQwQEFkb2JlSUQiLCJjdHAiOjAsImZnIjoiV1ZFRTJEUTVIUEU3SUhXT0dPUUZRSFFBUlU9PT09PT0iLCJzaWQiOiIxNjU5NTA5ODEwMjM1X2JlZjg4ODNjLTg1MzYtNDQ0OC04ZWY0LWVkYjMzODljNGNjMl91ZTEiLCJydGlkIjoiMTY1OTUxNjM1OTQ5Nl9mNWU5YTBkNi1iMzk2LTRkZmQtYTVjOC03NTZhN2E3ODgwZjhfdXcyIiwibW9pIjoiOTRjZDBjMzgiLCJwYmEiOiIiLCJydGVhIjoiMTY2MDcyNTk1OTQ5NiIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoiQWRvYmVJRCxvcGVuaWQscmVhZF9vcmdhbml6YXRpb25zLGFkZGl0aW9uYWxfaW5mby5wcm9qZWN0ZWRQcm9kdWN0Q29udGV4dCIsImNyZWF0ZWRfYXQiOiIxNjU5NTE2MzU5NDk1In0.DBpLXIM-klPWpm3qIfqe2mkOV1bE0MQKfn1H2mlGg5TbA2x7ZDjgdXlCgBQ5-faME47sKXd2G46KIsxNocJxwem9G0Pk_jC97XP7hfdLLobf27Vd0byuu_2RgaFp8Qkt2WfcIxnH3c8zDPIDjymUaZIpN2NokJDfmhw-CEBvKVj2quv3vnzt03pZLUTH5gFqZqAdkmdSd-WLobS94yLllnFSKlt3E3komEws9yXJvMtT_MqVSkGLQMU2tO0QpZ5_KMnN1bIwUmGqUHH2fMiqdPcyCsTaW9knXpwP0yLlUcWwAsd3gobgcwsHr_0uPIggB67j3MseES4K5r_7XJSBuw',
      },
    });

    const wrappedSchema = wrapSchema({
      schema: remoteSchema,
      transforms: [
        // new RenameTypes((type) => {
        //   let newType = type;

        //   // if (type.includes('AssetCollection')) {
        //   //For AEM
        //   newType = newType.replace('List', 'Collection');
        //   // }
        //   return newType;
        // }),

        // new RenameRootTypes((type) => {
        //   let newType = type;

        //   // if (type.includes('AssetCollection')) {
        //   //For AEM
        //   newType = newType.replace('List', 'Collection');
        //   // }
        //   return newType;
        // }),

        // new RenameRootFields((operationName, fieldName, fieldConfig) => {
        //   let newType = type;

        //   // if (type.includes('AssetCollection')) {
        //   //For AEM
        //   newType = newType.replace('List', 'Collection');
        //   // }
        //   return newType;
        // }),

        new RenameRootFields((typeName, fieldName, fieldConfig) => {
          let newType = fieldName;

          // if (type.includes('AssetCollection')) {
          //For AEM
          newType = newType.replace('List', 'Collection');
          // }
          return newType;
        }),

        new RenameObjectFields((typeName, fieldName, fieldConfig) => {
          let newType = fieldName;

          // if (type.includes('AssetCollection')) {
          //For AEM
          if(newType === '_path'){
           
          newType = newType.replace('_path', 'id');
          }
          return newType;
        }),


        
        // new RenameObjectFieldArguments((typeName, fieldName, argName) => {
        //   // let _fieldName = fieldName;
        //   let _argName = argName;
        //   // if (_fieldName === 'tab') {
        //     _argName = argName.replace('id', 'user_id');
        //   // }
        //   return _argName;
        // }),





        // new RenameInterfaceFields((typeName, fieldName, fieldConfig) => `new_${fieldName}`),
        // new RenameInputObjectFields((typeName, fieldName, inputFieldConfig) => `new_${fieldName}`)
      ],
    });

    return {
      schema: wrappedSchema,
    };
  }
}
