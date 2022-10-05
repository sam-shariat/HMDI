from pyteal import *

#from marketplace_contract import Product
# from profile_contract import Profile
from comments_contract import Comments

if __name__ == "__main__":
    approval_program = Comments().approval_program()
    clear_program = Comments().clear_program()

    # Mode.Application specifies that this is a smart contract
    compiled_approval = compileTeal(approval_program, Mode.Application, version=6)
    print(compiled_approval)
    with open("HMDI_comments_approval.teal", "w") as teal:
        teal.write(compiled_approval)
        teal.close()

    # Mode.Application specifies that this is a smart contract
    compiled_clear = compileTeal(clear_program, Mode.Application, version=6)
    print(compiled_clear)
    with open("HMDI_comments_clear.teal", "w") as teal:
        teal.write(compiled_clear)
        teal.close()