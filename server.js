var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
var {accounts} = require('./data'); //เอาเฉพาะ accounts ที่อยู่ใน data

var app = express();
var PORT = process.env.port || 3000

var AccountType = new graphql.GraphQLObjectType({
  name: "accounts",
  description: "Detail of The account",
  fields: () => ({
    account_id: {
     type: graphql.GraphQLString,
     description: "รหัสผู้ใช้",
    },
    name: {
      type: graphql.GraphQLString,
      description: "ชื่อผู้ใช้",
    },
    surname: {
      type: graphql.GraphQLString,
      description: "นามสกุล",
    },
    balance: {
      type: graphql.GraphQLInt,
      description: "เงินในบัญชี",
    }
 })
});

var queryType = new graphql.GraphQLObjectType({
    name: "QueryAccount",
    description: "query account informations",
    fields: () => ({
      allaccounts: {
        type: new graphql.GraphQLList(AccountType),
        description: "ดึงข้อมูล account ทั้งหมดที่มีในระบบ",
        resolve: function(_, args){
          return accounts
        }
      },
      getAccount: {
        type: AccountType,
        description: "ดึงข้อมูล account จาก id",
        args: {
          id: {
            type: graphql.GraphQLString,
            description: "รหัสผู้ใช้"
          }
        },
        resolve: function(_, args){
          let account = accounts.filter(acc => acc.account_id === args.id)
          return account[0]
        }
      },
      hey: {
        type: graphql.GraphQLString,
        description: "ทดสอบ แสดงผล hello world",
        resolve: function(_, args){
          return 'hello world'
        }
      },
      hello: {
        type: graphql.GraphQLString,
        args: {
          name: {
            type: graphql.GraphQLString,
            description: "ชื่อที่ต้องการทักทาย"
          }
        },
        resolve: function(_, args){
          return 'hello world' + args.name
        }
      }
    })
  })

  var mutationType = new graphql.GraphQLObjectType({
    name: "mutationAccount",
    description: "mutation of account",
    fields: () => ({
      addAccount: {
        type: AccountType,
        args: {
          account_id: {
            type: graphql.GraphQLString,
            description: "รหัสผู้ใช้",
           },
           name: {
             type: graphql.GraphQLString,
             description: "ชื่อผู้ใช้",
           },
           surname: {
             type: graphql.GraphQLString,
             description: "นามสกุล",
           },
           balance: {
             type: graphql.GraphQLInt,
             description: "เงินในบัญชี",
           }
        },
        resolve: function(_, args){
          var account = {
            account_id: args.account_id,
            name: args.name,
            surname: args.surname,
            balance: args.balance
          }
          accounts.push(account)
          return account
        }
      }
    })
  });

var MyGraphQLSchema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
  });

app.use('/graphql', graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true
  }));

app.listen(PORT);
console.log("Server running on localhost:", PORT);