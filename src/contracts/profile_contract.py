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
            Assert(Txn.application_args.length() == Int(4)),
            Assert(Txn.note() == Bytes("HMDI-profiles:uv002")),
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.bio, Txn.application_args[2]),
            App.globalPut(self.Variables.link, Txn.application_args[3]),
            Approve()
        ])

    def edit(self):
        is_owner = Txn.sender() == Global.creator_address()

        update_state = Seq([
            Assert(Txn.application_args.length() == Int(5)),
            App.globalPut(self.Variables.name, Txn.application_args[1]),
            App.globalPut(self.Variables.image, Txn.application_args[2]),
            App.globalPut(self.Variables.bio, Txn.application_args[3]),
            App.globalPut(self.Variables.link, Txn.application_args[4]),
            Approve()
        ])

        return If(is_owner).Then(update_state).Else(Reject())

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            [Txn.application_args[0] == self.AppMethods.edit, self.edit()],
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
