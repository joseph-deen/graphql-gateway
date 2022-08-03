import { GraphQLModule } from "@nestjs/graphql";
import { GqlConfigService } from './graphql.config.service';
import { ApolloDriver } from "@nestjs/apollo";

export default GraphQLModule.forRootAsync({
  useClass: GqlConfigService,
  driver: ApolloDriver    
});
