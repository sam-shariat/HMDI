from pyteal import *


class Product:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        description = Bytes("DESCRIPTION")
        link = Bytes("LINK")
        donation = Bytes("DONATION")
        goaldonation = Bytes("GOALDONATION")
        donated = Bytes("DONATED")
        uwallets = Bytes("UWALLETS")
        
    class AppMethods:
        donate = Bytes("donate")

    def application_creation(self):
        return Seq([
            Assert(Txn.application_args.length() == Int(6)),
            Assert(Txn.note() == Bytes("HMDI:uv001")),
            Assert(Btoi(Txn.application_args[4]) > Int(0)),
            Assert(Btoi(Txn.application_args[5]) > Int(0)),
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.description, Txn.application_args[2]),
            App.globalPut(self.Variables.link, Txn.application_args[3]),
            App.globalPut(self.Variables.donation, Btoi(Txn.application_args[4])),
            App.globalPut(self.Variables.goaldonation,Btoi(Txn.application_args[5])),
            App.globalPut(self.Variables.donated, Int(0)),
            App.globalPut(self.Variables.uwallets, Int(0)),
            Approve()
        ])

    def donate(self):
        count = Txn.application_args[1]
        valid_number_of_transactions = Global.group_size() == Int(2)
        
        valid_payment_to_seller = And(
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == Global.creator_address(),
            Gtxn[1].amount() == App.globalGet(self.Variables.donation) * Btoi(count),
            Gtxn[1].sender() == Gtxn[0].sender(),
        )

        can_donate = And(valid_number_of_transactions, valid_payment_to_seller)

        update_state = Seq([
            App.globalPut(self.Variables.donated, App.globalGet(self.Variables.donated) + Btoi(count)),
            App.globalPut(self.Variables.uwallets, App.globalGet(self.Variables.uwallets) + Int(1)),
            Approve()
        ])

        return If(can_donate).Then(update_state).Else(Reject())

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication, self.application_deletion()],
            [Txn.application_args[0] == self.AppMethods.donate, self.donate()]
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))
