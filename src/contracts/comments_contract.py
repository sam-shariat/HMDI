from pyteal import *


class Comments:
    class Variables:
        uid = Bytes("UID")
        comment = Bytes("COMMENT")

    def application_creation(self):
        return Seq([
            Assert(Txn.application_args.length() == Int(2)),
            Assert(Txn.note() == Bytes("HMDI-comments:uv002")),
            App.globalPut(self.Variables.uid, Btoi(Txn.application_args[0])),
            App.globalPut(self.Variables.comment, Txn.application_args[1]),
            Approve()
        ])

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()]
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
