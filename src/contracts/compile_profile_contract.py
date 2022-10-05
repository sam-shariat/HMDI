from pyteal import *

# from marketplace_contract import Product
from profile_contract import Profile
# from comments_contract import Comments

if __name__ == "__main__":
    approval_program = Profile().approval_program()
    clear_program = Profile().clear_program()

    # Mode.Application specifies that this is a smart contract
    compiled_approval = compileTeal(approval_program, Mode.Application, version=6)
    print(compiled_approval)
    with open("HMDI_profile_approval.teal", "w") as teal:
        teal.write(compiled_approval)
        teal.close()

    # Mode.Application specifies that this is a smart contract
    compiled_clear = compileTeal(clear_program, Mode.Application, version=6)
    print(compiled_clear)
    with open("HMDI_profile_clear.teal", "w") as teal:
        teal.write(compiled_clear)
        teal.close()