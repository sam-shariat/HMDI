from pyteal import *


class Profile:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        bio = Bytes("BIO")
        link = Bytes("LINK")

    class AppMethods:
        edit = Bytes("edit")

    def application_creation(self):
        return Seq([
            Assert(Txn.application_args.length() == Int(5)),
            Assert(Txn.note() == Bytes("HMDI-profiles:uv001")),
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.bio, Txn.application_args[2]),
            App.globalPut(self.Variables.link, Txn.application_args[3]),
            Approve()
        ])

    def edit(self):
        Assert(
            And(
                # The number of transactions within the group transaction must be exactly 2.
                # first one being the adopt function and the second being the payment transactions
                Global.group_size() == Int(1),

                # check that the buy call is made ahead of the payment transaction
                Txn.group_index() == Int(0),

                # check if the app creator is the one that call edit
                Txn.sender() == Global.creator_address(),

                # Txn.applications[0] is a special index denoting the current app being interacted with
                Txn.applications.length() == Int(1),

                # The number of arguments attached to the transaction should be exactly 2.
                Txn.application_args.length() == Int(6),
            ),
        )

        return Seq([
            App.globalPut(self.Variables.name, Txn.application_args[1]),
            App.globalPut(self.Variables.image, Txn.application_args[2]),
            App.globalPut(self.Variables.bio, Txn.application_args[3]),
            App.globalPut(self.Variables.link, Txn.application_args[4]),
            Approve()
        ])

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication, self.application_deletion()],
            [Txn.application_args[0] == self.AppMethods.edit, self.edit()],
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
